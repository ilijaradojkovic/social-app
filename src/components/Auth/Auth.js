import React, { useState } from "react";
import { Avatar, Button, Paper, Grid, Typography, Container } from "@material-ui/core";
import useStyles from "./styles";
import Input from "./Input";
import Icon from "./icon";
import { AUTH } from "../../constants/actionTypes";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { signin, signup } from "../../actions/auth";
import ReCAPTCHA from "react-google-recaptcha";

const initialState = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

const Auth = () => {
	const classes = useStyles();
	const [showPassword, setShowPassword] = useState(false);
	const [isSignup, setIsSignup] = useState(false);
	const dispatch = useDispatch();
	const history = useNavigate();
	const [formData, setFormData] = useState(initialState);
	const [disabled, setDisabled] = useState(true);

	const handleSubmit = e => {
		e.preventDefault();
		console.log(formData);

		if (isSignup) {
			dispatch(signup(formData, history));
		} else {
			dispatch(signin(formData, history));
		}
	};

	const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

	const switchMode = () => {
		// setForm(initialState);
		setIsSignup(prevIsSignup => !prevIsSignup);
		setShowPassword(false);
	};
	const handleShowPassword = () => setShowPassword(!showPassword);

	const googleSuccess = async res => {
		const result = res?.profileObj;
		const token = res?.tokenId;

		try {
			dispatch({ type: AUTH, data: { result, token } });

			history("/");
		} catch (error) {
			console.log(error);
		}
	};

	const googleError = () => alert("Google Sign In was unsuccessful. Try again later");
	const handleChangeCaptcha = () => setDisabled(false);

	return (
		<Container component="main" maxWidth="xs">
			<Paper className={classes.paper} elevation={3}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					{isSignup ? "Sign up" : "Sign in"}
				</Typography>
				<form className={classes.form} onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						{isSignup && (
							<>
								<Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
								<Input name="lastName" label="Last Name" handleChange={handleChange} half />
							</>
						)}
						<Input name="email" label="Email Address" handleChange={handleChange} type="email" />
						<Input
							name="password"
							label="Password"
							handleChange={handleChange}
							type={showPassword ? "text" : "password"}
							handleShowPassword={handleShowPassword}
						/>
						{isSignup && (
							<Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />
						)}
					</Grid>
					<Button
						disabled={disabled}
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						{isSignup ? "Sign Up" : "Sign In"}
					</Button>
					<GoogleLogin
						clientId="596366112633-mfgsggpqv9hhd8l5eupgqs2uutc8o237.apps.googleusercontent.com"
						render={renderProps => (
							<Button
								disabled={disabled}
								className={classes.googleButton}
								color="primary"
								fullWidth
								onClick={renderProps.onClick}
								// disabled={renderProps.disabled}
								startIcon={<Icon />}
								variant="contained"
							>
								Google Sign In
							</Button>
						)}
						onSuccess={googleSuccess}
						onFailure={googleError}
						cookiePolicy="single_host_origin"
					/>
					<Grid container justify="center">
						<ReCAPTCHA sitekey="6LfDm_4fAAAAAGe3u_4IV-NxbT7YUNBWybSj6wR0" onChange={handleChangeCaptcha}></ReCAPTCHA>
					</Grid>
					<Grid container justify="flex-end">
						<Grid item>
							<Button onClick={switchMode}>
								{isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign Up"}
							</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
		</Container>
	);
};

export default Auth;
