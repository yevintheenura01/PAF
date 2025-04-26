import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { TETabs, TETabsItem } from "tw-elements-react";
import PostsList from "../components/PostsList";
import axios from "axios";
import toast from "react-hot-toast";
import WorkoutStatus from "./WorkoutStatus";
import WorkoutPlan from "./WorkoutPlan";
import MealPlan from "./MealPlan";
import { useActiveTab } from "../context/ActiveTabContext";
import { SharedPostlist } from "../components/SharedPostlist";
import { FaDumbbell, FaRegClock, FaClipboardList, FaUtensils } from 'react-icons/fa';

const Home = () => {
  const { activeTab, setActiveTab } = useActiveTab();
  const [user, setUser] = useState(null);
  const [reFetchPost, setReFetchPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const [reFetchSharedPost, setReFetchSharedPost] = useState(false);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/posts");
        setPosts(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllPosts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const userData = localStorage.getItem("user");
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const deletePost = (deletedPost) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPost.id)
    );
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/posts");
        setPosts(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllPosts();
  }, [reFetchPost]);

  useEffect(() => {
    const fetchAllSharedPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/share");
        setSharedPosts(data);
      } catch (error) {
        toast.error("Server error");
      }
    };
    fetchAllSharedPosts();
  }, [reFetchSharedPost]);

  return (
    <Layout>
      <>
      <div className="mb-1">
  <TETabs fill className="">
    <TETabsItem
      onClick={() => setActiveTab("tab1")}
      active={activeTab === "tab1" || activeTab === "" ? true : false}
      icon={<FaDumbbell />}
      className="bg-gray-800"
      style={{ 
        fontSize: "0.8rem",
        backgroundColor: activeTab === "tab1" || activeTab === "" ? "#E09145" : "#292C35",
        color: "#FFFFFF",
        transition: "background-color 0.2s ease",
      }}
    >
      <FaDumbbell /> Workout Posts
    </TETabsItem>
    <TETabsItem
      onClick={() => setActiveTab("tab2")}
      active={activeTab === "tab2" ? true : false}
      icon={<FaRegClock />}
      className="bg-gray-800"
      style={{ 
        fontSize: "0.8rem",
        backgroundColor: activeTab === "tab2" ? "#E09145" : "#292C35",
        color: "#FFFFFF",
        transition: "background-color 0.2s ease",
      }}
    >
      <FaRegClock /> Workout Status
    </TETabsItem>
    <TETabsItem
      onClick={() => setActiveTab("tab3")}
      active={activeTab === "tab3" ? true : false}
      icon={<FaClipboardList />}
      className="bg-gray-800"
      style={{ 
        fontSize: "0.8rem",
        backgroundColor: activeTab === "tab3" ? "#E09145" : "#292C35",
        color: "#FFFFFF",
        transition: "background-color 0.2s ease",
      }}
    >
      <FaClipboardList /> Workout Plan
    </TETabsItem>
    <TETabsItem
      onClick={() => setActiveTab("tab4")}
      active={activeTab === "tab4" ? true : false}
      icon={<FaUtensils />}
      className="bg-gray-800"
      style={{ 
        fontSize: "0.8rem",
        backgroundColor: activeTab === "tab4" ? "#E09145" : "#292C35",
        color: "#FFFFFF",
        transition: "background-color 0.2s ease",
        
      }}
    >
      <FaUtensils /> Meal Plan
    </TETabsItem>
  </TETabs>
</div>



        {activeTab === "tab1" && (
          <div>
            {posts?.map((post, index) => {
              return (
                <PostsList
                  post={post}
                  user={user}
                  key={index}
                  onUpdatePost={updatePost}
                  onDeletePost={deletePost}
                  reFetchPost={reFetchPost}
                  setReFetchPost={setReFetchPost}
                  setReFetchSharedPost={setReFetchSharedPost}
                  reFetchSharedPost={reFetchSharedPost}
                />
              );
            })}
            {sharedPosts?.map((sharePost, index) => {
              return (
                <SharedPostlist
                  post={sharePost}
                  user={user}
                  reFetchSharedPost={reFetchSharedPost}
                  setReFetchSharedPost={setReFetchSharedPost}
                />
              );
            })}
          </div>
        )}

        {activeTab === "tab2" && (
          <div>
            {/**
             * 1. Create a new component called WorkoutStatusList
             */}
            <WorkoutStatus user={user} />
          </div>
        )}

        {activeTab === "tab3" && (
          <div>
            {/**
             * 1. Create a new component called WorkoutPlanList
             */}
            <WorkoutPlan user={user} />
          </div>
        )}

        {activeTab === "tab4" && (
          <div>
            {/**
             * 1. Create a new component called MealPlanList
             */}
            <MealPlan user={user} />
          </div>
        )}

        
      </>
    </Layout>
  );
};

export default Home;
