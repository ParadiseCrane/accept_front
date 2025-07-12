import ClientPage from './ClientPage';

export default async function CoursePage(props: {
  params: Promise<{ course: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;

  return <ClientPage spec={params.course} />;
}
