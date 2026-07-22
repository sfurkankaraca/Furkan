import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPostBySlug, blogSlugs } from "@/lib/blog/registry";
import { BlogArticleLayout } from "@/components/blog/BlogArticleLayout";
import { BLOG_ARTICLE_BODIES } from "@/components/blog/article-bodies";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  if (!post) return { title: "Yazı bulunamadı" };
  return {
    title: `${post.title} | noqta blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  const Body = BLOG_ARTICLE_BODIES[slug];
  if (!post || !Body) notFound();

  return (
    <BlogArticleLayout post={post}>
      <Body />
    </BlogArticleLayout>
  );
}
