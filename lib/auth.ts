import { auth } from "@/auth";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user.role;
};

export async function getAdminSession() {
  const session = await auth();

  if (!session || session.user.role === "USER") {
    return null;
  }

  return session;
}

// Example of How the getAdminSession will be used in serverComponents and route handlers
// export async function GET() {
//   const session = await getAdminSession();

//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   // Your admin-only API logic here
//   return NextResponse.json({ message: 'Admin-only data' });
// }
