import React from 'react';
import { supabase } from '../supabaseClient';

const GoogleAuthButton = ({ label = 'Sign in with Google', onSuccess, onError, redirectTo }) => {
	const handleGoogleSignIn = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: redirectTo || (window.location.origin + '/book') }
		});
		if (error && onError) onError(error);
		// Supabase will redirect on success, so onSuccess is not usually called here
	};
	return (
		<button
			type="button"
			onClick={handleGoogleSignIn}
			className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-slate-700 text-white font-medium border border-slate-600 hover:bg-slate-600 hover:border-slate-500 transition-all duration-200 shadow-lg"
		>
			<svg width="20" height="20" viewBox="0 0 48 48" className="flex-shrink-0"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.69 30.7 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.01l7.2 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29c-1.01-2.9-1.01-6.08 0-8.98l-7.98-6.2C.99 17.13 0 20.45 0 24c0 3.55.99 6.87 2.69 9.89l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.7 0 12.68-2.69 16.97-7.35l-7.2-5.6c-2.01 1.35-4.59 2.15-7.77 2.15-6.38 0-11.87-3.63-14.33-8.89l-7.98 6.2C6.73 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
			<span>{label}</span>
		</button>
	);
};

export default GoogleAuthButton;