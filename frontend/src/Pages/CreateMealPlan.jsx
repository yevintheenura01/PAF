import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import CreateBG from "../images/CreateBG.png";
import { useNavigate, useParams } from "react-router-dom";
import { TEInput, TETextarea } from "tw-elements-react";
import { useActiveTab } from "../context/ActiveTabContext";
import axios from "axios";
import toast from "react-hot-toast";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../db/firebase";

const storage = getStorage(app);

const CreateMealPlan = () => {
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const [selectedDietaryPreference, setSelectedDietaryPreference] =
    useState("vegan");
  const [recipes, setRecipes] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [cookingInstruction, setCookingInstruction] = useState("");
  const [nutritionalInformation, setNutritionalInformation] = useState("");
  const [portionSizes, setPortionSizes] = useState("");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState("");
  const [user, setUser] = useState({});
  const [editMealPlans, setEditMealPlans] = useState(false);
  const [source, setSource] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setActiveTab } = useActiveTab();

  const { mealPlanId } = useParams();

  // Add validation state variables
  const [errors, setErrors] = useState({
    recipes: "",
    ingredients: "",
    cookingInstruction: "",
    nutritionalInformation: "",
    portionSizes: "",
    date: "",
    image: "",
  });

  // Add validation function
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!selectedMealType) {
      tempErrors.mealType = "Meal type is required";
      isValid = false;
    }

    if (!selectedDietaryPreference) {
      tempErrors.dietaryPreference = "Dietary preference is required";
      isValid = false;
    }

    if (!recipes.trim()) {
      tempErrors.recipes = "Recipe name is required";
      isValid = false;
    } else if (recipes.length < 3) {
      tempErrors.recipes = "Recipe name must be at least 3 characters";
      isValid = false;
    }

    if (!ingredients.trim()) {
      tempErrors.ingredients = "Ingredients are required";
      isValid = false;
    } else if (ingredients.length < 10) {
      tempErrors.ingredients =
        "Please provide a more detailed list of ingredients";
      isValid = false;
    }

    if (!cookingInstruction.trim()) {
      tempErrors.cookingInstruction = "Cooking instructions are required";
      isValid = false;
    } else if (cookingInstruction.length < 20) {
      tempErrors.cookingInstruction =
        "Please provide more detailed cooking instructions";
      isValid = false;
    }

    if (!nutritionalInformation.trim()) {
      tempErrors.nutritionalInformation = "Nutritional information is required";
      isValid = false;
    }

    if (!portionSizes) {
      tempErrors.portionSizes = "Portion size is required";
      isValid = false;
    } else if (isNaN(portionSizes) || parseInt(portionSizes) <= 0) {
      tempErrors.portionSizes = "Portion size must be a positive number";
      isValid = false;
    }

    if (!date) {
      tempErrors.date = "Date is required";
      isValid = false;
    } else {
      const selectedDate = new Date(date);
      const today = new Date();

      if (selectedDate < new Date(today.setHours(0, 0, 0, 0))) {
        tempErrors.date = "Date cannot be in the past";
        isValid = false;
      }
    }

    if (!image && !source) {
      tempErrors.image = "Please upload an image";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Update the onImageChange function to include validation
  const onImageChange = (e) => {
    const selectedFiles = e.target.files;
    setErrors({ ...errors, image: "" });

    if (!selectedFiles || selectedFiles.length === 0) {
      setErrors({ ...errors, image: "Please select an image" });
      return;
    }

    const currentFile = selectedFiles[0];

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(currentFile.type)) {
      setErrors({ ...errors, image: "File must be JPEG, JPG or PNG" });
      return;
    }

    // Validate file size (max 5MB)
    if (currentFile.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: "Image size should be less than 5MB" });
      return;
    }

    setImage(currentFile);
  };

  useEffect(() => {
    const fetchSingleMealPlan = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/mealPlans/${mealPlanId}`
        );
        setRecipes(data.recipes);
        setIngredients(data.ingredients);
        setCookingInstruction(data.cookingInstruction);
        setNutritionalInformation(data.nutritionalInformation);
        setPortionSizes(data.portionSizes);
        setSource(data.source);
        setDate(data.date);
        console.log(data);
        setEditMealPlans(true);
        setSelectedMealType(data.mealType);
        setSelectedDietaryPreference(data.dietaryPreferences);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleMealPlan();
  }, [mealPlanId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  // Update the handleSubmit function to use validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation before proceeding
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      toast.error("User not logged in");
      return;
    }

    if (
      !selectedMealType ||
      !selectedDietaryPreference ||
      !recipes ||
      !ingredients ||
      !cookingInstruction ||
      !nutritionalInformation ||
      !portionSizes ||
      !date
    ) {
      setIsLoading(false);
      return toast.error("Please fill all the fields");
    }

    if (!image && !source) {
      setIsLoading(false);
      return toast.error("Please upload an image");
    }

    let imageUrl = null;

    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const mealPlanData = {
      userId: user.id,
      mealType: selectedMealType,
      dietaryPreferences: selectedDietaryPreference,
      recipes,
      ingredients,
      cookingInstruction,
      nutritionalInformation,
      portionSizes,
      source: imageUrl,
      date,
    };

    const updateMealPlanData = {
      userId: user.id,
      mealType: selectedMealType,
      dietaryPreferences: selectedDietaryPreference,
      recipes,
      ingredients,
      cookingInstruction,
      nutritionalInformation,
      portionSizes,
      source: imageUrl ? imageUrl : source,
      date,
    };

    console.log(mealPlanData);

    if (editMealPlans) {
      try {
        const res = await axios.put(
          `http://localhost:8080/mealPlans/update/${mealPlanId}`,
          updateMealPlanData
        );
        if (res.status === 200) {
          toast.success("Meal Plans Updated Successfully");
          setRecipes("");
          setSelectedMealType("");
          setSelectedDietaryPreference("");
          setIngredients("");
          setCookingInstruction("");
          setNutritionalInformation("");
          setPortionSizes("");
          setSource("");
          setDate("");
          navigate("/");
          setActiveTab("tab4");
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Failed to update workout plans");
      }
    } else {
      try {
        const res = await axios.post(
          `http://localhost:8080/mealPlans/add`,
          mealPlanData
        );
        if (res.status === 201) {
          toast.success("Meal Plans added Successfully");
          setRecipes("");
          setSelectedMealType("");
          setSelectedDietaryPreference("");
          setIngredients("");
          setCookingInstruction("");
          setNutritionalInformation("");
          setPortionSizes("");
          setSource("");
          setDate("");
          navigate("/");
          setActiveTab("tab4");
        }
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to add meal plans");
        setIsLoading(false);
      }
    }
  };

  const navigate = useNavigate();

  const goToMealPlans = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div
        className="min-h-screen p-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${CreateBG})` }}
      >
        <form onSubmit={handleSubmit}>
          <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-neutral-200">
              {editMealPlans ? "Edit Meal Plan" : "Create Meal Plan"}
            </h1>
            <div className="relative md:w-96">
              <label
                htmlFor="mealType"
                className="block text-sm font-medium text-neutral-200 items-center"
              >
                Select Meal Type
              </label>
              <select
                name="mealType"
                className={`border rounded h-10 w-full p-2 mt-4 bg-gray-800 text-neutral-200 ${
                  errors.mealType ? "border-red-500" : ""
                }`}
                value={selectedMealType}
                onChange={(e) => {
                  setSelectedMealType(e.target.value);
                  setErrors({ ...errors, mealType: "" });
                }}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
              {errors.mealType && (
                <p className="text-red-500 text-xs mt-1">{errors.mealType}</p>
              )}
            </div>

            <div className="relative md:w-96 mt-2">
              <label
                htmlFor="dietaryPreferences"
                className="block text-sm font-medium text-neutral-200 items-center"
              >
                Select Dietary Preferences
              </label>
              <select
                name="dietaryPreferences"
                className={`border rounded h-10 w-full p-2 mt-4 bg-gray-800 text-neutral-200 ${
                  errors.dietaryPreference ? "border-red-500" : ""
                }`}
                value={selectedDietaryPreference}
                onChange={(e) => {
                  setSelectedDietaryPreference(e.target.value);
                  setErrors({ ...errors, dietaryPreference: "" });
                }}
              >
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="keto">Keto</option>
                <option value="gluten-free">Gluten-Free</option>
              </select>
              {errors.dietaryPreference && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dietaryPreference}
                </p>
              )}
            </div>

            <TEInput
              type="text"
              label="Recipes Name"
              className={`my-4 bg-gray-800 text-white ${
                errors.recipes ? "border-red-500" : ""
              }`}
              value={recipes}
              onChange={(e) => {
                setRecipes(e.target.value);
                setErrors({ ...errors, recipes: "" });
              }}
            ></TEInput>
            {errors.recipes && (
              <p className="text-red-500 text-xs mt-1">{errors.recipes}</p>
            )}

            <TETextarea
              value={ingredients}
              onChange={(e) => {
                setIngredients(e.target.value);
                setErrors({ ...errors, ingredients: "" });
              }}
              className={`my-5 bg-gray-800 text-white ${
                errors.ingredients ? "border-red-500" : ""
              }`}
              id="ingredients"
              label="Ingredients"
              rows={3}
            ></TETextarea>
            {errors.ingredients && (
              <p className="text-red-500 text-xs mt-1">{errors.ingredients}</p>
            )}

            <TETextarea
              value={cookingInstruction}
              onChange={(e) => {
                setCookingInstruction(e.target.value);
                setErrors({ ...errors, cookingInstruction: "" });
              }}
              className={`my-5 bg-gray-800 text-white ${
                errors.cookingInstruction ? "border-red-500" : ""
              }`}
              id="cooking-instruction"
              label="Cooking Instruction"
              rows={4}
            ></TETextarea>
            {errors.cookingInstruction && (
              <p className="text-red-500 text-xs mt-1">
                {errors.cookingInstruction}
              </p>
            )}

            <TETextarea
              value={nutritionalInformation}
              onChange={(e) => {
                setNutritionalInformation(e.target.value);
                setErrors({ ...errors, nutritionalInformation: "" });
              }}
              className={`my-5 bg-gray-800 text-white ${
                errors.nutritionalInformation ? "border-red-500" : ""
              }`}
              id="nutritional-info"
              label="Nutritional Information"
              rows={2}
            ></TETextarea>
            {errors.nutritionalInformation && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nutritionalInformation}
              </p>
            )}

            <TEInput
              type="number"
              label="Portion Sizes (g - gram)"
              className={`my-5 bg-gray-800 text-white ${
                errors.portionSizes ? "border-red-500" : ""
              }`}
              value={portionSizes}
              onChange={(e) => {
                setPortionSizes(e.target.value);
                setErrors({ ...errors, portionSizes: "" });
              }}
              min="1"
            ></TEInput>
            {errors.portionSizes && (
              <p className="text-red-500 text-xs mt-1">{errors.portionSizes}</p>
            )}

            <div className="mb-3 w-96">
              <label
                htmlFor="formFile"
                className="mb-2 inline-block text-neutral-200 dark:text-neutral-200"
              >
                Upload picture of your meal
              </label>
              <input
                className={`relative m-0 block w-full min-w-0 flex-auto rounded border border-solid px-3 py-[0.32rem] text-base font-normal text-neutral-200 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-gray-800 file:px-3 file:py-[0.32rem] file:text-neutral-200 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary ${
                  errors.image ? "border-red-500" : "border-neutral-300"
                }`}
                type="file"
                id="formFile"
                accept="image/png, image/jpeg, image/jpg"
                onChange={onImageChange}
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>

            <TEInput
              type="date"
              className={`my-5 text-white ${
                errors.date ? "border-red-500" : ""
              }`}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setErrors({ ...errors, date: "" });
              }}
            ></TEInput>
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="meal"
                className="w-40 h-40 "
              />
            )}

            {!image && source && (
              <img src={source} alt="meal" className="w-40 h-40" />
            )}

            <button
              type="submit"
              className="w-full mt-6 px-4 py-2 text-sm font-medium text-neutral-200 bg-yellow-500 rounded-md shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : editMealPlans ? "Update" : "Create"}
            </button>

            <button
              onClick={goToMealPlans}
              className="w-full px-4 mt-2 py-2 text-sm font-medium text-black bg-transparent rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateMealPlan;
