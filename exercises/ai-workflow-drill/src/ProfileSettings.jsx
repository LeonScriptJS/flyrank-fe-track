import { useEffect, useState } from 'react'
import Field from './components/Field.jsx'

const STORAGE_KEY = 'profile-settings'

const initialProfile = {
  name: '',
  username: '',
  email: '',
  bio: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(profile) {
  const errors = {}

  if (!profile.name.trim()) {
    errors.name = 'Full name is required.'
  }

  if (!profile.username.trim()) {
    errors.username = 'Username is required.'
  } else if (!/^[a-z0-9._-]+$/i.test(profile.username.trim())) {
    errors.username = 'Use only letters, numbers, and . _ - characters.'
  }

  if (!profile.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(profile.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

function loadProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...initialProfile, ...JSON.parse(saved) } : initialProfile
  } catch {
    return initialProfile
  }
}

function ProfileSettings() {
  const [profile, setProfile] = useState(loadProfile)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setStatus('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate(profile)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = document.querySelector('[aria-invalid="true"]')
      firstInvalid?.focus()
      setStatus('')
      return
    }

    setStatus('Profile saved successfully.')
  }

  const handleReset = () => {
    setProfile(initialProfile)
    setErrors({})
    setStatus('')
  }

  return (
    <main className="settings">
      <header className="settings-header">
        <h1>Profile settings</h1>
        <p>Update your personal details and how you appear to others.</p>
      </header>

      <form className="settings-form" noValidate onSubmit={handleSubmit}>
        <Field
          id="name"
          name="name"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={profile.name}
          onChange={handleChange}
          error={errors.name}
        />

        <Field
          id="username"
          name="username"
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="ada.lovelace"
          value={profile.username}
          onChange={handleChange}
          error={errors.username}
          hint="Public name shown next to your posts."
        />

        <Field
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="ada@example.com"
          value={profile.email}
          onChange={handleChange}
          error={errors.email}
          hint="Used for sign-in and notifications."
        />

        <div className="field">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            maxLength="160"
            value={profile.bio}
            onChange={handleChange}
            aria-describedby="bio-hint"
          />
          <small id="bio-hint" className="hint">
            {profile.bio.length}/160 characters
          </small>
        </div>

        <div className="actions">
          <button type="submit" className="btn btn-primary">
            Save changes
          </button>
          <button type="button" className="btn" onClick={handleReset}>
            Reset
          </button>
        </div>

        <p className="status" role="status" aria-live="polite">
          {status}
        </p>
      </form>
    </main>
  )
}

export default ProfileSettings