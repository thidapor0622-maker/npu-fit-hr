import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { STAFF_DIVISIONS_DATA, getStaffDivisionBySlug } from '@/data/staff-divisions';
import StaffDivisionDetailClient from '@/components/StaffDivisionDetailClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return STAFF_DIVISIONS_DATA.map((div) => ({
    slug: div.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const division = getStaffDivisionBySlug(params.slug);
  if (!division) {
    return {
      title: 'ไม่พบฝ่ายงาน - คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม',
    };
  }
  return {
    title: `${division.title} - คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม`,
    description: `ทำเนียบบุคลากรสายสนับสนุนประจำ${division.title} คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม`,
  };
}

export default function Page({ params }: PageProps) {
  const division = getStaffDivisionBySlug(params.slug);
  if (!division) {
    notFound();
  }

  return <StaffDivisionDetailClient division={division} />;
}
