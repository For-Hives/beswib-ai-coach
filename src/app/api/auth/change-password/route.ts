import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();

    // 1. Authenticate user
    const currentUser = await requireAuth(req);
    if (!currentUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // 2. Get passwords from body
    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Ancien et nouveau mot de passe requis' }, { status: 400 });
    }
    if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
    }

    // 3. Find user in DB
    const user = await User.findById(currentUser._id);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // 4. Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'L\'ancien mot de passe est incorrect' }, { status: 400 });
    }

    // 5. Hash new password and save it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Mot de passe modifié avec succès' });

  } catch (error: any) {
    // Handle specific errors like token verification failure from requireAuth
    if (error.message.includes('Non autorisé')) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Erreur lors du changement de mot de passe:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
} 