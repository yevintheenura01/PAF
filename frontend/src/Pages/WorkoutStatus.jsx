import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import CreateBG from '../images/CreateBG.png';

const WorkoutStatus = ({ user }) => {
  const [workoutStatuses, setWorkoutStatuses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkoutStatuses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/workoutStatus");
        if (res.status === 200) {
          setWorkoutStatuses(res.data);
        }
      } catch (error) {
        toast.error("Failed to fetch workout statuses");
      }
    };
    fetchWorkoutStatuses();
  }, []);

  const deleteWorkOut = async (status) => {
    try {
      await axios.delete(
        `http://localhost:8080/workoutStatus/${status.statusId}`
      );

      setWorkoutStatuses((prevStatuses) =>
        prevStatuses.filter((s) => s.statusId !== status.statusId)
      );

      toast.success("Workout status deleted successfully");
    } catch (error) {
      toast.error("Failed to delete workout status");
    }
  };

  const navigateEditPage = (status) => {
    navigate(`/CreateWorkoutStatus/${status.statusId}`);
  };

  return (
    <div
    className=" p-4 min-h-screen  bg-cover bg-center"
    style={{ backgroundImage: `url(${CreateBG})` }}>
      <div className="flex justify-between items-center">
        {/* <h1 className="text-3xl text-center font-semibold mb-4">
          Workout Statuses
        </h1> */}
      </div>

      <div className="space-y-4 flex justify-center flex-col items-center">
        {workoutStatuses.map((status, index) => (
          <div
            key={index}
            className=" shadow-lg bg-gray-800 rounded-lg p-4 w-[600px]" style={{border: "2px solid #E09145" }}
          >
            <div className="flex justify-between ">
              <div className="flex gap-3">
                <div>
                  <img
                    src={status?.userProfile}
                    alt="user"
                    className="w-14 h-14 rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-200">{status?.username}</h2>
                  <p className="text-sm font-bold mb-2 text-neutral-200">
                    Workout on {status.date}
                  </p>
                </div>
              </div>
              <div className="gap-3 flex">
                {user?.id === status?.userId && (
                  <>
                    <AiFillDelete
                      size={20}
                      color="white"
                      className="cursor-pointer"
                      onClick={() => deleteWorkOut(status)}
                    />
                    <AiFillEdit
                      size={20}
                      color="white"
                      className="cursor-pointer"
                      onClick={() => navigateEditPage(status)}
                    />
                  </>
                )}
              </div>
            </div>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-neutral-200">
              <li>Distance run: {status.distance}<span className="text-neutral-200 text-xs">Km </span></li>
              <li>Number of push-ups: {status.pushUps}</li>
              <li>Weight lifted: {status.weight}<span className="text-neutral-200 text-xs">Kg </span> </li>
            </ul>
            <p className="mt-4 text-base text-neutral-200">
            {status.description}
                </p>
          </div>
        ))}
      </div>
    </div>
    // </Layout>
  );
};

export default WorkoutStatus;
