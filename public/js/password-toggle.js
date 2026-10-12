document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const inputId = button.dataset.passwordTarget;
            const passwordInput = document.getElementById(inputId);

            if (!passwordInput) {
                console.error('Password input not found:', inputId);
                return;
            }

            const isHidden = passwordInput.type === 'password';

            passwordInput.type = isHidden ? 'text' : 'password';

            button.textContent = isHidden ? '🙈' : '👁️';

            button.setAttribute(
                'aria-label',
                isHidden ? 'Hide password' : 'Show password'
            );

            button.setAttribute('aria-pressed', String(isHidden));
        });
    });

    // Check that password and confirmation match during registration.
    const registerForm = document.querySelector('form[action="/register"]');

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');

            if (!password || !confirmPassword) return;

            if (password.value !== confirmPassword.value) {
                event.preventDefault();
                confirmPassword.setCustomValidity('Passwords do not match.');
                confirmPassword.reportValidity();
            } else {
                confirmPassword.setCustomValidity('');
            }
        });

        const confirmPassword = document.getElementById('confirmPassword');

        if (confirmPassword) {
            confirmPassword.addEventListener('input', () => {
                confirmPassword.setCustomValidity('');
            });
        }
    }
});