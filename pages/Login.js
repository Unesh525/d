// pages/Login.js
import Image from 'next/image';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';


export default function Login() {

  const { data: session, status } = useSession()

  if (status === "loading") {
    // here we can create any loader for UI
    return <>
    <div className='loadingdata flex flex-col flex-center wh_100'>
      <Loading/>
    </div>
    </>

  }

  const router = useRouter();

  async function login() {
    await router.push('/');
    await signIn();
  }

  if (session) {
    router.push('/');
    return null; // return null or any loading indicator
  }
  // not login then show login page
  else {
    return (
      <>
        <div className='loginfront flex flex-center flex-col full-w'>
          <Image src='/img/mypic.jpg' width={250} height={250} alt='my profile' />
          <h1>Welcome Admin</h1>
          <button className='mt-2' onClick={login}>Login with Google</button>

        </div>
      </>
    )
  }


}
