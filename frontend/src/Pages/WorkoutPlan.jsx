//WorkoutPlan.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import CreateBG from '../images/CreateBG.png';


const WorkoutPlan = ({ user }) => {
  const [workoutPlans, setWorkoutPlans] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        const res = await axios.get("http://localhost:8080/workoutPlans");
        if (res.status === 200) {
          setWorkoutPlans(res.data);
        }
      } catch (error) {
        toast.error("Failed to fetch workout plans");
      }
    };
    fetchWorkoutPlans();
  }, []);

  // Delete Workout Plans by ID
  const deleteWorkOutPlan = async (workoutplans) => {
    try {
      await axios.delete(
        `http://localhost:8080/workoutPlans/${workoutplans.workoutPlanId}`
      );

      setWorkoutPlans((prevWokoutPlans) =>
        prevWokoutPlans.filter((wp) => wp.workoutPlanId !== workoutplans.workoutPlanId)
      );

      toast.success("Workout Plan deleted successfully");
    } catch (error) {
      toast.error("Failed to delete workout Plan");
    }
  };


  const navigateEditPage = (workoutplans) => {
    navigate(`/CreateWorkoutPlan/${workoutplans.workoutPlanId}`);
  };

  // Function to handle click event
  // const goToWorkoutPlan = () => {
  //   navigate('/CreateWorkoutPlan'); // Use the route you want to navigate to
  // };

  return (
    <div
      className=" p-4 min-h-screen  bg-cover bg-center"
      style={{ backgroundImage: `url(${CreateBG})` }}
    >
      <div className="flex justify-between items-center">
        {/* <button
          onClick={goToWorkoutPlan}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Create New Workout Plan
        </button> */}
      </div>

      <div className="space-y-4 flex justify-center flex-col items-center">
        {workoutPlans.map((workoutplans, index) => (
          <div
            key={index}
            className="shadow-lg bg-gray-800 rounded-lg p-4 w-[600px]" style={{ border: "2px solid #E09145" }}
          >
            <div className="flex justify-between ">
              <div className="flex gap-3">
                <div>
                  <img
                    src={workoutplans?.userProfile}
                    alt="user"
                    className="w-14 h-14 rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-200">
                    {workoutplans?.username}
                  </h2>
                  <p className="text-sm font-bold mb-2 text-neutral-200">
                    Workout on {workoutplans.date}
                  </p>
                </div>
              </div>
              <div className="gap-3 flex">
                {user?.id === workoutplans?.userId && (
                  <>
                    <AiFillDelete
                      size={20}
                      color="white"
                      className="cursor-pointer"
                      onClick={() => deleteWorkOutPlan(workoutplans)}
                    />
                    <AiFillEdit
                      size={20}
                      color="white"
                      className="cursor-pointer"
                      onClick={() => navigateEditPage(workoutplans)}
                    />
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="list-disc pl-5 space-y-1 mt-2">
                <h2 className="text-xl font-semibold mb-2 text-neutral-200">
                  {workoutplans.workoutPlanName}
                </h2>
                <p className="font-medium text-neutral-200">
                  Exercise: {workoutplans.exercises}
                </p>
                <p className="text-sm text-neutral-200">Sets: {workoutplans.sets}</p>
                <p className="text-sm text-neutral-200">
                  Repetitions: {workoutplans.repetitions}
                </p>
                <p className="text-sm text-neutral-200">Routine: {workoutplans.routine}</p>
                <p className="text-sm italic text-neutral-200">"{workoutplans.description}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default WorkoutPlan;
