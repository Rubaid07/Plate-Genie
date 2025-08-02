"use client";

import { useState } from 'react';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setUsername('');
                setEmail('');
                setPassword('');
            } else {
                setMessage(data.message || 'Registration failed.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-card rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-foreground">Create an Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground">Username</label>
                    <input
                        type="text"
                        className="mt-1 p-2 w-full border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground">Email</label>
                    <input
                        type="email"
                        className="mt-1 p-2 w-full border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground">Password</label>
                    <input
                        type="password"
                        className="mt-1 p-2 w-full border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary p-2 rounded-md font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            {message && <p className={`mt-4 text-center ${message.includes('success') ? 'text-primary' : 'text-red-500'}`}>{message}</p>}
        </div>
    );
};

export default RegisterForm;