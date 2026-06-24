import { Router } from 'express';
import { supabaseClient, supabaseAdmin } from '../config/supabase';
import { requireAuth } from '../middleware/auth';

const router = Router();

// -------------------- SIGN UP --------------------
router.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;

    // Validate role
    if (!['candidate', 'employer'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "candidate" or "employer"' });
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, role } // stored in user_metadata
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Create profile record in our profiles table
    if (data.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([{
          id: data.user.id,
          email,
          full_name,
          role
        }]);

      if (profileError) {
        const safeEmail = email.replace(/[\r\n]/g, '_');
        console.error(`Profile creation error for ${safeEmail}:`, profileError.message);
        return res.status(500).json({ error: 'Account created but profile setup failed' });
      }
    }

    res.status(201).json({
      message: 'Signup successful',
      user: data.user,
      session: data.session
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------- SIGN IN --------------------
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({
      message: 'Signin successful',
      user: data.user,
      session: data.session
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------- SIGN OUT --------------------
router.post('/signout', async (req, res) => {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Signed out successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------- GET CURRENT USER --------------------
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get profile data
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return res.status(500).json({ error: 'Profile not found' });
    }

    res.json({ user, profile });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------- LIST CANDIDATES --------------------
router.get('/candidates', requireAuth, async (req, res) => {
  try {
    const { data: candidates, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .eq('role', 'candidate');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ candidates });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;