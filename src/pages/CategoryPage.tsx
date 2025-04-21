import { useParams } from "react-router-dom";
import { getCategoryTitle } from "@/hooks/useCategories";
import { useCategoryPosts } from "@/hooks/useCategoryPosts";
import { CategorySkeleton } from "@/components/category/CategorySkeleton";
import { CategoryPostList } from "@/components/category/CategoryPostList";
import { CategoryHero } from "@/components/category/CategoryHero";
import { motion, AnimatePresence } from "framer-motion";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { posts, loading } = useCategoryPosts(categoryId);
  const isAllPostsView = categoryId === 'all';

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div key={`category-page-${categoryId}`}>
          <CategoryHero category={categoryId || 'all'} />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="py-12 bg-background"
          >
            <div className="container-custom">
              {loading ? (
                <CategorySkeleton isAllPostsView={isAllPostsView} />
              ) : (
                <CategoryPostList posts={posts} isAllPostsView={isAllPostsView} />
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CategoryPage;
