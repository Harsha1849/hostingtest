'use client';

import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';
// import Image from 'next/image';

export default function SignIn() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaGoogle className="h-5 w-5 text-red-500" />
            Continue with Google
          </button>
        </div>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 

// import { signIn } from 'next-auth/react';
// import { FaGoogle } from 'react-icons/fa';
// import Image from 'next/image';

// export default function SignIn() {
//   return (
//     <div className="min-h-[80vh] flex items-center justify-center">
//       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Sign in to your account to continue
//           </p>
//         </div>
//         <div className="mt-8 space-y-6">
//           <button
//             onClick={() => signIn('google', { callbackUrl: '/' })}
//             className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             <FaGoogle className="h-5 w-5 text-red-500" />
//             Continue with Google
//           </button>
//         </div>
//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Or</span>
//             </div>
//           </div>
//         </div>
//         <div className="mt-6">
//           <p className="text-center text-sm text-gray-600">
//             Don't have an account?{' '}
//             <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//               Sign up
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// } 