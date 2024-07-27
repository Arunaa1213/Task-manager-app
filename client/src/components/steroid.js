export default function validate(email, password){
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // const emailIsValid = emailRegex.test(email);
    // const passwordIsValid = passwordRegex.test(password);

    // return {
    //     email: emailIsValid,
    //     password: passwordIsValid
    // };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

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