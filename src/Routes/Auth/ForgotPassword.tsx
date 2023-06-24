import React, { useState } from 'react'
import image from '../../assets/page1.png'
import { Divider, Title, TextInput, PasswordInput, Button, Text } from '@mantine/core'
import { useNavigate } from "react-router-dom"
import { useForm } from '@mantine/form'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'

export const ForgotPassword = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const form = useForm({
        initialValues: {
            email: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    return (
        <form onSubmit={form.onSubmit(async (values) => {
            try {
                setLoading(true)
                await sendPasswordResetEmail(auth, values.email);
                navigate("/signin")
                setLoading(false)
                showNotification({
                    id: `reg-err-${Math.random()}`,
                    autoClose: 5000,
                    title: 'Success!',
                    message: `Reset link sent to ${values.email}`,
                    color: 'green',
                    icon: <IconCheck />,
                    loading: false,
                });
            } catch (error: any) {
                if (error.code === "auth/user-not-found") {
                    showNotification({
                        id: `reg-err-${Math.random()}`,
                        autoClose: 5000,
                        title: 'Error!',
                        message: "Email not found create new account",
                        color: 'red',
                        icon: <IconX />,
                        loading: false,
                    });
                    navigate("/signin")
                    return
                }
                showNotification({
                    id: `reg-err-${Math.random()}`,
                    autoClose: 5000,
                    title: 'Error!',
                    message: "Error sending reset link try again",
                    color: 'red',
                    icon: <IconX />,
                    loading: false,
                });
            } finally {
                setLoading(false)
            }
        })}>
            <div className='min-h-screen grid md:grid-cols-2'>
                <div
                    className='h-full'
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                ></div>
                <div className='p-5 md:w-3/4 md:m-auto space-y-5'>
                    <Title align='center' pb={30}>
                        Reset Password
                    </Title>
                    <div
                        className='space-y-3'
                    >
                        <TextInput
                            placeholder='Example.email@gmail.com'
                            label='Email'
                            variant='unstyled'
                            classNames={{
                                root: "border-solid border-b-[1px] border-black",
                                input: "px-3"
                            }}
                            {...form.getInputProps("email")}
                        />
                        <div>
                            <Button fullWidth loading={loading} type='submit' >
                                Send Reset Link
                            </Button>
                        </div>
                    </div>
                    <Divider label='Or' labelPosition="center" />
                    <div className='flex gap-2 text-xs select-none justify-center'>
                        <Text>Remember password?</Text>
                        <Text
                            color='blue'
                            className='cursor-pointer hover:scale-105 duration-100 ease-linear'
                            onClick={() => navigate('/signin')}
                        >Log In</Text>
                    </div>
                </div>
            </div>
        </form>
    )
}
