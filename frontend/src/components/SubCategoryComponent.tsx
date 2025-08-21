import { ModalComponent } from "./ModalComponent";
import { useCategoryService } from "../hooks/useCategory.service";
import { useState } from "react";
import { useSubCategoryService } from "../hooks/useSubCategory.service";
import type { SubCategory } from "../interfaces/SubCategory.interface";
import { useForm } from "react-hook-form";

export const SubCategoryComponent = () => {
  const { categories } = useCategoryService();

  const [open, setOpen] = useState(false);

  const { subCategories, create, deleted, updated } = useSubCategoryService();

  const [atribute, setAtribute] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Partial<SubCategory>>({
    defaultValues: {
      name: "",
      description: "",
      categoryid: 0,
    },
  });

  const handleUpdateAtribute = (item: Partial<SubCategory>) => {
    try {
      setValue("name", item.name);
      setValue("description", item.description);
      setValue("categoryid", item.categoryid);
      setValue("id", item.id);
      setAtribute(true);
      handleOpenModal();
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    reset();
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCreateSubCategory = (data: Partial<SubCategory>) => {
    try {
      if (atribute === true) {
        updated(`${data.id}`, data);
        reset();
        handleCloseModal();
      } else {
        create(data);
        reset();
        handleCloseModal();
      }
    } catch (error) {
      throw new Error(error as string);
    }
  };

  return (
    <>
      <ModalComponent
        onClose={handleCloseModal}
        open={open}
        title={atribute ? "updated Subcategory" : "create Subcategory"}
        content={
          <>
            <form
              className="grid grid-cols-1"
              onSubmit={handleSubmit(handleCreateSubCategory)}
            >
              <label htmlFor="">add name</label>
              <input
              placeholder="add name"
                {...register("name", { required: "name is required" })}
                type="text"
                className="input w-auto m-4"
              />
              <span className={errors ? "text-error" : ""}>
                {errors.name?.message}
              </span>
              <label htmlFor="">add description</label>
              <input
              placeholder="add description"
                {...register("description", {
                  required: "description is required",
                })}
                type="text"
                className="input w-auto m-4"
              />
              <span className={errors ? "text-error" : ""}>
                {errors.description?.message}
              </span>
              <label htmlFor="">add category</label>
              <select 
                {...register("categoryid", {
                  required: "category is required",
                })}
                className="select"
              >
                {categories.map((item) => (
                  <option value={item.id as number}>{item.name}</option>
                ))}
              </select>
              <span className={errors ? "text-error" : ""}>
                {errors.categoryid?.message}
              </span>
              <div>
                <button className="btn btn-primary m-4">
                  {atribute ? "updated" : "create"}
                </button>
              </div>
            </form>
          </>
        }
      />
      <button onClick={handleOpenModal} className="btn btn-primary mb-5">
        add
      </button>

      <div>
        {subCategories.length > 0 ? (
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <td>actions</td>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {subCategories.map((item) => (
                  <tr key={item.id}>
                    <th>{item.id}</th>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.id}</td>
                    <td>
                      <button
                        className="btn btn-accent m-3"
                        onClick={() => handleUpdateAtribute(item)}
                      >
                        update
                      </button>
                      <button
                        onClick={() => deleted(`${item.id}`)}
                        className="btn btn-error m-3"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid justify-center">
            {" "}
            <div>
              <p className="text-4xl">sub categories not found</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
