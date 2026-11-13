import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { DEPARTMENTS_DATA, getDepartmentBySlug } from '@/data/departments';
import DepartmentDetailClient from '@/components/DepartmentDetailClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return DEPARTMENTS_DATA.map((dept) => ({
    slug: dept.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const department = getDepartmentBySlug(params.slug);
  if (!department) {
    return {
      title: 'ไม่พบสาขาวิชา - คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม',
    };
  }
  return {
    title: `${department.title} - คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม`,
    description: `ทำเนียบอาจารย์และบุคลากรผู้สอนประจำ${department.title} คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม`,
  };
}

export default function Page({ params }: PageProps) {
  const department = getDepartmentBySlug(params.slug);
  if (!department) {
    notFound();
  }

  return <DepartmentDetailClient department={department} />;
}
