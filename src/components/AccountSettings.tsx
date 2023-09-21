import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from './Auth';
import { AuthContextValue } from '@appTypes/authTypes';

interface UserDetails {
	userInfo: {
		username: string;
		email: string;
		firstname: string;
		lastname: string;
	};
}



const defaultTheme = createTheme();

export default function AccountSettings() {
	const { userDetails, changePass, deleteAcct, handleLogout } = useAuth() as AuthContextValue;
	const [errorMsg, setErrorMsg] = useState<string>('');
	const [successMsg, setSuccessMsg] = useState<string>('');
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [openPasswordDialog, setOpenPasswordDialog] = useState<boolean>(false);

	const username: string = userDetails.userInfo.username;
	const email: string = userDetails.userInfo.email;

	useEffect(() => {
		document.title = 'MusicPlug: Account Settings';
	});
	
	const handleClickOpen = (type: string) => (event: React.MouseEvent) => {
		event.preventDefault();
		if (type === "delete") {
			setOpenDialog(true);
		} else if (type === "password") {
			setOpenPasswordDialog(true);
		}
	};


	const handleClose = () => {
		setOpenDialog(false);
	};

	const handleChangePw = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const passwordOld = event.target['current-password'].value;
		const passwordNew = event.target['new-password'].value;
		const passwordConfirm = event.target['confirm-password'].value;
		if (passwordNew !== passwordConfirm) {
			setErrorMsg("New passwords do not match.");
			return;
		}
		try {
			const responseMessage = await changePass(username, email, passwordOld, passwordNew);
			if (responseMessage === 'pw changed successful') {
				setSuccessMsg('Successfully changed password');
				setErrorMsg('');
			}
		} catch (err) {
			if (err instanceof Error) {
				setErrorMsg(err.message || 'An error occurred');
			} else {
				setErrorMsg('An error occurred');
			}
			setSuccessMsg('');
		}

	};

	const handleDeleteAcct = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.preventDefault();
		try {
			const responseMessage = await deleteAcct(username, email);
			if (responseMessage === 'successfully deleted account') {
				setSuccessMsg('Successfully deleted account');
				setErrorMsg('');
			}
			handleClose();
			setTimeout(() => {
				handleLogout();
			}, 1000);

		} catch (err) {
			if (err instanceof Error) {
				setErrorMsg(err.message || 'An error occurred');
			} else {
				setErrorMsg('An error occurred');
			}
			setSuccessMsg('');
		}

	}

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component="main" maxWidth="xs" sx={{ backgroundColor: 'white' }}>
				<CssBaseline />
				<Box
					sx={{
						marginTop: 2,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
						<ManageAccountsIcon />
					</Avatar>
					<Typography component="h1" variant="h5" sx={{ color: 'black', marginBottom: 2 }}>
						Account Settings
					</Typography>

					<Typography variant="subtitle1" gutterBottom>Personal Information</Typography>
					<Box sx={{ width: '100%', mb: 2, pl: 2, pr: 2 }}>
						<Typography variant="body1" color='#424242'>
							<strong>First Name:</strong> {userDetails.userInfo.firstname}
						</Typography>
						<Typography variant="body1" color='#424242' mt={1}>
							<strong>Last Name:</strong> {userDetails.userInfo.lastname}
						</Typography>
						<Typography variant="body1" color='#424242' mt={1}>
							<strong>Email:</strong> {email}
						</Typography>
					</Box>
					<Typography variant="subtitle1" gutterBottom>Change Password</Typography>
					<Box component="form" noValidate onSubmit={handleChangePw} sx={{ mt: 1, width: '100%' }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="oldpassword"
									label="Current Password"
									name="current-password"
									type="password"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="new-password"
									label="New Password"
									type="password"
									id="new-password"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="confirm-password"
									label="Confirm New Password"
									type="password"
									id="confirm-password"
								/>
							</Grid>
							{/* Error message display */}
							<Grid item xs={12}>
								{errorMsg && (
									<Typography color="error" style={{ textAlign: 'center', marginTop: '10px' }}>{errorMsg}</Typography>
								)}
								{successMsg && (
									<Typography color="#4caf50" style={{ textAlign: 'center', marginTop: '10px' }}>{successMsg}</Typography>
								)}
							</Grid>
							<Grid item xs={12}>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 2 }}
								>
									Change Password
								</Button>
							</Grid>
							<Grid container justifyContent="flex-end" mt={2}>
								<Grid item>
									<Link href="/deleteaccount" onClick={handleClickOpen("delete")} variant="body2" color="error">
										Delete your account
									</Link>

									<Dialog
										open={openDialog}
										onClose={handleClose}
										aria-labelledby="alert-dialog-title"
										aria-describedby="alert-dialog-description"
									>
										<DialogTitle id="alert-dialog-title">{"Delete Account"}</DialogTitle>
										<DialogContent>
											<DialogContentText id="alert-dialog-description">
												Are you sure you want to delete your account? This action cannot be undone.
											</DialogContentText>
										</DialogContent>
										<DialogActions>
											<Button onClick={handleClose} color="primary">
												Cancel
											</Button>
											<Button onClick={handleDeleteAcct} color="primary" autoFocus>
												Confirm
											</Button>
										</DialogActions>
									</Dialog>

								</Grid>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
