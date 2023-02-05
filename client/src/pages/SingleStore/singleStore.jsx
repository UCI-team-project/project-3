/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import FooterComponent from "../../Components/footer/footer";
import HeaderComponent from "../../Components/header";
import RecentReviewsContainer from "../../Components/recentReviews/recentReviewsContainer";
import { StarOutlined } from "@ant-design/icons";
import style from "./singleStore.module.css";
import { useQuery } from "@apollo/client";
import { GET_STORE } from "../../utils/queries";
import { useMutation } from "@apollo/client";
import { FAV_STORE } from "../../utils/mutations";

export default function SingleStore() {
  const store_id = useParams();

  const location = useLocation();
  const path = location.pathname.split("/");
  const storeID = path[path.length - 1];

  // this is the query used to retrieve a store from db if needed
  // const { loading, data } = useQuery(GET_STORE(store_id));
  // const storeData = data?.getStore || {};

  const [reviews, setReviews] = useState({});
  const [storeData, setStoreData] = useState({});

  useEffect(() => {
    document.title = `CommuniTEA - ${storeData?.name}`;
    fetchYelpReviews();
    fetchStoreDetails();
  }, []);

  // --> I think we should just use reviews from out site right? <--
  // well depends, we can save the store to our database when a use clicks
  // on a search results, therefore it can be in our database prior to rendering
  // this page. but i also think its fine to only save store to db if user
  // interacts with it (review, react, favorites)...

  const expressAPI = process.env.REACT_APP_API_ENDPOINT;

  const [save, { error, data }] = useMutation(FAV_STORE);

  const favoriteStore = async (e) => {
    e.preventDefault();
    console.log(storeData.id);
    try {
      const { saveData } = await save({
        variables: { store_id: storeData.id },
      });
      console.log(saveData);
    } catch (err) {
      console.error(err);
    }
  };

  // functions to fetch yelp reviews and single store information
  async function fetchYelpReviews() {
    const endpoint = `/reviews/${storeID}`;
    const api = expressAPI + endpoint;
    await fetch(api, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((reviews) => setReviews(reviews));
  }
  async function fetchStoreDetails() {
    const endpoint = `/store/${storeID}`;
    const api = expressAPI + endpoint;
    await fetch(api, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((stores) => setStoreData(stores));
  }

  // if (loading) {
  //   <h2>Loading...</h2>
  // }

  return (
    <>
      {storeData && (
        <>
          <div className={style.navContainer}>
            <HeaderComponent />
          </div>
          <main className={style.main}>
            <div className={style.contentWrapper}>
              <header className={style.header}>
                <h1>
                  <a href={storeData.url} target="_blank">
                    {storeData.name}
                  </a>
                </h1>
              </header>
              <section className={style.photoContainer}>
                {storeData?.photos?.map((photo) => (
                  <img src={photo} className={style.image} />
                ))}
              </section>
              <div className={style.descriptionWrapper}>
                <section className={style.storeDescription}>
                  <div>
                    <article>
                      <div className={style.categoryContainer}>
                        {storeData?.categories?.map((category, key) => (
                          <p key={key}>{category.alias}</p>
                        ))}
                      </div>
                      <p id="rating" className={style.rating}>
                        {storeData?.rating} <StarOutlined />
                      </p>
                      <p>{storeData?.location?.address1}</p>
                      <p>
                        {storeData?.location?.city},{" "}
                        {storeData?.location?.state}{" "}
                        {storeData?.location?.zip_code}
                      </p>
                      <p>price: {storeData?.price}</p>
                      <p>{storeData?.display_phone}</p>
                      <button
                        className={style.addToFavBtn}
                        onClick={favoriteStore}
                      >
                        Add to favorites
                      </button>
                    </article>
                  </div>
                </section>
                <section className={style.reviewsContainer}>
                  <RecentReviewsContainer reviews={reviews} />
                </section>
              </div>
              <article className={style.reviewFormArticle}>
                <form action="#" className={style.reviewForm}>
                  <label htmlFor="comment">Comments</label>
                  <textarea
                    name="review"
                    id="reviewForm"
                    cols="30"
                    rows="10"
                    placeholder="Leave a comment..."
                  ></textarea>
                  <div className={style.reviewBtnContainer}>
                    <button className={style.reviewBtn}>Post</button>
                  </div>
                </form>
              </article>
            </div>
          </main>
          <FooterComponent />
        </>
      )}
    </>
  );
}
