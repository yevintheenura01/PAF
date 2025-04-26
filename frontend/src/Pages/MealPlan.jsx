import React, { useEffect, useState } from "react";
import CreateBG from "../images/CreateBG.png";
import { TERipple } from "tw-elements-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";


const MealPlan = ({ user }) => {
  const [mealPlans, setMealPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const res = await axios.get("http://localhost:8080/mealPlans");
        if (res.status === 200) {
          setMealPlans(res.data);
        }
      } catch (error) {
        toast.error("Failed to fetch meal plans");
      }
    };
    fetchMealPlans();
  }, []);

  // Delete Meal Plan by ID
  const deleteMealPlan = async (mealPlan) => {
    try {
      await axios.delete(`http://localhost:8080/mealPlans/${mealPlan.mealPlanId}`);
      setMealPlans(prevMealPlans => prevMealPlans.filter(mp => mp.mealPlanId !== mealPlan.mealPlanId));
      toast.success("Meal Plan deleted successfully");
    } catch (error) {
      toast.error("Failed to delete Meal Plan");
    }
  };

  const navigateEditPage = (mealPlan) => {
    navigate(`/CreateMealPlan/${mealPlan.mealPlanId}`);
  };

  return (
    <div
    className="p-4 min-h-screen  bg-cover bg-center"
    style={{ backgroundImage: `url(${CreateBG})` }}
    >
      <div className="space-y-6 max-w-xl mx-auto rounded-lg shadow-md ">
        {mealPlans.map((mealPlan, index) => (
          <div key={index} className="rounded-lg bg-gray-800 shadow-md p-4 " style={{border: "2px solid #E09145" }}>
            <div className="overflow-hidden bg-cover bg-no-repeat mb-2 w-sm h-sm sm:w-sm sm:h-sm">
              <img className="rounded-t-lg w-full h-full" src={mealPlan?.source} alt="" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={mealPlan?.userProfile}
                    className="w-10 h-10 rounded-full mr-4"
                    alt="ProfileImage"
                  />
                  <p className="text-md font-medium leading-tight text-neutral-200">
                    {mealPlan?.username}
                  </p>
                </div>
                <p className="text-base text-neutral-200">
                  {mealPlan?.date}
                </p>
              </div>
              <h6 className="mb-4 text-xl font-bold leading-tight text-neutral-200 underline">
                {mealPlan?.recipes}
              </h6>
              <p className=" text-sm text-base text-neutral-200">
              <span className="text-neutral-200k text-xs">Meal Type: </span>{mealPlan?.mealType} 
              </p>
              <p className=" text-sm text-base text-neutral-200">
              <span className="text-neutral-200 text-xs">Dietary Preferences: </span> {mealPlan?.dietaryPreferences} 
              </p>
              <p className=" text-sm mb-2 text-base text-neutral-200">
              <span className="text-neutral-200 text-xs">Portion Sizes: </span>  {mealPlan?.portionSizes}
              </p>
              
              <div className="mb-4">
                <h6 className="mb-1 text-lg font-bold leading-tight text-neutral-200">
                  Ingredients
                </h6>
                <p className="text-base text-neutral-200">
                  {mealPlan?.ingredients}
                </p>
              </div>
              <div className="mb-4">
                <h6 className="mb-1 text-lg font-bold leading-tight text-neutral-200">
                  Cooking Instruction
                </h6>
                <p className="text-base text-neutral-200">
                  {mealPlan?.cookingInstruction}
                </p>
              </div>
              <div className="mb-4">
                <h6 className="text-xl font-medium leading-tight text-neutral-200">
                  Nutritional Information
                </h6>
                <p className="text-base text-neutral-200">
                  {mealPlan?.nutritionalInformation}
                </p>
              </div>
              <div className="flex justify-end">
                {user?.id === mealPlan?.userId && (
                  <>
                    <AiFillDelete
                      size={20}
                      color="red"
                      className="cursor-pointer mr-2"
                      onClick={() => deleteMealPlan(mealPlan)}
                    />
                    <AiFillEdit
                      size={20}
                      color="blue"
                      className="cursor-pointer"
                      onClick={() => navigateEditPage(mealPlan)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlan;
