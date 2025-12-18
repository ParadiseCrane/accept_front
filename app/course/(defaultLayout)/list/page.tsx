import ClientPage from "./ClientPage";

export default async function CoursePage(props: {
  params: Promise<{ course: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <ClientPage />;
}
