import axios from "axios";
import AnimationWrapper from "../common/page-Animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
// import { activeTabLineRef } from "../components/inpage-navigation.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const HomePage = () => {
  let [blogs, setBlog] = useState(null);
  let [trendingBlogs, setTrendingBlog] = useState(null);
  let [pageState, setPageState] = useState("home");
  let categories = [
    "programming",
    "life style",
    "cooking",
    "technology",
    "health care",
    "travel",
    "events"
  ];


  const fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then( async ({ data }) => {
        // console.log(data.blogs);

        let formattedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/all-latest-blogs-count",
        });
        // console.log(formattedData)
        setBlog(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBlogsByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formattedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { tag: pageState },
        });

        setBlog(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlog(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setBlog(null);

    if (pageState == category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };

  useEffect(() => {
    activeTabRef.current.click();

    if (pageState == "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <>
      <AnimationWrapper>
        <section className="h-cover flex justify-center gap-10">
          {/* Latest blogs section */}
          <div className="w-full">
            <InPageNavigation
              routes={[pageState, "trending blogs"]}
              defaultHidden={["trending blogs"]}
            >
              <>
                {blogs == null ? (
                  <Loader />
                ) : blogs.results.length ? (
                  blogs.results.map((blog, i) => {
                    return (
                      <AnimationWrapper
                        transition={{ duration: 1, delay: i * 0.1 }}
                        key={i}
                      >
                        <BlogPostCard
                          content={blog}
                          author={blog.author.personal_info}
                        />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoDataMessage message="No blogs have been published in this category yet!" />
                )}

                <LoadMoreDataBtn
                  state={blogs}
                  fetchDataFun={
                    pageState == "home"
                      ? fetchLatestBlogs
                      : fetchBlogsByCategory
                  }
                />
              </>

              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.length ? (  
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No trending blogs found!" />
              )}
            </InPageNavigation>
          </div>

          {/* Filters and Trending blog section */}

          <div className="min-w-[40%] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden lg:min-w-[400px]">

            <div className="flex flex-col gap-10">

              <div>
                <h1 className="mb-8 text-xl font-medium">
                  Explore & Discover stories
                </h1>

            
                <div className="flex flex-wrap gap-3">
                  {categories.map((category, i) => {
                    return (
                      <button
                        key={i}
                        className={
                          "tag " +
                          (pageState == category ? " bg-black text-white" : " ")
                        }
                        onClick={loadBlogByCategory}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h1 className="mb-8 text-xl font-medium">
                  Trending <i className="bi bi-arrow-up-right"></i>
                </h1>

                {trendingBlogs == null ? (
                  <Loader />
                ) : trendingBlogs.length ? (
                  trendingBlogs.map((blog, i) => {
                    return (
                      <AnimationWrapper
                        transition={{ duration: 1, delay: i * 0.1 }}
                        key={i}
                      >
                        <MinimalBlogPost blog={blog} index={i} />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoDataMessage message="No trending blogs found!" />
                )}
              </div>
            </div>

          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default HomePage;
