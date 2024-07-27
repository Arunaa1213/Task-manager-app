export default function validate(formState) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    let emailError = "True";
    let passwordError = "True";
    let confirmpasswordError = "True";
    let firstnameError = "True";
    let lastnameError = "True";

    if (!formState.firstname.trim()) {
        firstnameError = "First name is required.";
    }

    if (!formState.lastname.trim()) {
        lastnameError = "Last name is required.";
    }

    if (!emailRegex.test(formState.email)) {
        emailError = "Invalid email format. Ensure it contains '@' and a domain part.";
    }

    if (formState.password.length < 8) {
        passwordError = "Password must be at least 8 characters long.";
    } else if (!/[a-z]/.test(formState.password)) {
        passwordError = "Password must contain at least one lowercase letter.";
    } else if (!/[A-Z]/.test(formState.password)) {
        passwordError = "Password must contain at least one uppercase letter.";
    } else if (!/\d/.test(formState.password)) {
        passwordError = "Password must contain at least one digit.";
    } else if (!/[!@#$%^&*]/.test(formState.password)) {
        passwordError = "Password must contain at least one special character (!@#$%^&*).";
    }

    if (formState.password !== formState.confirmpassword) {
        confirmpasswordError = "Passwords do not match.";
    }

    return {
        firstname: firstnameError,
        lastname: lastnameError,
        email: emailError,
        password: passwordError,
        confirmpassword: confirmpasswordError
    };
}

export function validatelogin(email, password){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    let emailError = "True";
    let passwordError = "True";

    if (!emailRegex.test(email)) {
        emailError = "Invalid email format. Ensure it contains '@' and a domain part.";
    }

    if (password.length < 8) {
        passwordError = "Password must be at least 8 characters long.";
    } else if (!/[a-z]/.test(password)) {
        passwordError = "Password must contain at least one lowercase letter.";
    } else if (!/[A-Z]/.test(password)) {
        passwordError = "Password must contain at least one uppercase letter.";
    } else if (!/\d/.test(password)) {
        passwordError = "Password must contain at least one digit.";
    } else if (!/[!@#$%^&*]/.test(password)) {
        passwordError = "Password must contain at least one special character (!@#$%^&*).";
    }

    return {
        email: emailError,
        password: passwordError
    };
}
