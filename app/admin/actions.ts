'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  checkAdminPassword,
  clearAdminSession,
  getAdminPassword,
  setAdminSession,
  verifyAdminSession,
} from '@/lib/admin-auth';
import {
  deleteContactMessage as removeContactMessage,
  deleteEboardSubmission as removeEboardSubmission,
} from '@/lib/submissions';

export type LoginState = {
  error?: string;
};

export async function loginAdminAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get('password') ?? '');

  if (!getAdminPassword()) {
    return {
      error: 'The admin area is not set up yet. Add ADMIN_PASSWORD to the site settings to turn it on.',
    };
  }
  if (!checkAdminPassword(password)) {
    return { error: 'Incorrect password. Please try again.' };
  }

  await setAdminSession();
  redirect('/admin');
}

export async function logoutAdminAction(): Promise<void> {
  await clearAdminSession();
  redirect('/admin/login');
}

export async function deleteEboardSubmission(id: string): Promise<{ success: boolean }> {
  const isAuth = await verifyAdminSession();
  if (!isAuth) throw new Error('Unauthorized');
  try {
    await removeEboardSubmission(id);
    revalidatePath('/admin');
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function deleteContactSubmission(id: string): Promise<{ success: boolean }> {
  const isAuth = await verifyAdminSession();
  if (!isAuth) throw new Error('Unauthorized');
  try {
    await removeContactMessage(id);
    revalidatePath('/admin');
    return { success: true };
  } catch {
    return { success: false };
  }
}
