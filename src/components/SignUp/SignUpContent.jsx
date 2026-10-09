import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../lib/api';

export default function SignUpContent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', zoneCount: '1' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await authApi.signup({ ...form, zoneCount: Number(form.zoneCount) });
      navigate('/grow-rooms');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="content-wrapper auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Create your account</h1>
        <p>Set up your growing zones to start monitoring your farm.</p>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <label>Name<input name="name" value={form.name} onChange={updateField} required /></label>
        <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required /></label>
        <label>Password<input name="password" type="password" minLength="8" value={form.password} onChange={updateField} required /></label>
        <label>How many zones do you have?
          <input name="zoneCount" type="number" min="0" max="100" value={form.zoneCount} onChange={updateField} required />
        </label>
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</button>
        <span>Already have an account? <Link to="/login">Log in</Link></span>
      </form>
    </main>
  );
}
