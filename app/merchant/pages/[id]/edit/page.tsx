import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import PageEditor from '@/lib/page-builder/editor/PageEditor';

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

async function getPageData(id: string, token: string | undefined) {
  if (!token) return null;

  const res = await fetch(`${API_URL}/merchant/pages/${id}`, {
    headers: {
      'Cookie': `access_token=${token}`
    },
    cache: 'no-store'
  });

  if (!res.ok) return null;
  return res.json();
}

async function getMerchantStore(token: string | undefined) {
  if (!token) return null;

  const res = await fetch(`${API_URL}/merchant/me`, {
    headers: {
      'Cookie': `access_token=${token}`
    },
    cache: 'no-store'
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function EditPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    redirect('/login');
  }
  
  const [pageData, merchantData] = await Promise.all([
    getPageData(id, token),
    getMerchantStore(token)
  ]);

  if (!pageData || !merchantData) {
    notFound();
  }

  // Pass necessary data to the client component
  const page = {
    ...pageData,
    storeSlug: merchantData.store?.slug
  };

  return <PageEditor page={page} />;
}
