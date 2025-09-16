import { notFound } from "next/navigation";
import { getArticleByHandle } from "@/lib/shopify";
import BlogDetail from "@/layouts/components/BlogDetail";
import SeoMeta from "@/layouts/partials/SeoMeta";

export const dynamic = "force-dynamic";

interface BlogDetailPageProps {
  params: Promise<{
    handle: string;
  }>;
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { handle } = await params;
  const article = await getArticleByHandle({ handle });

  if (!article) {
    notFound();
  }

  return (
    <>
      <SeoMeta 
        title={article.seo?.title || article.title}
        description={article.seo?.description || article.excerpt}
      />
      
      <BlogDetail article={article} />
    </>
  );
};

export default BlogDetailPage;
