import { useState } from "react";
import { useCategoryService } from "../hooks/useCategory.service";
import { ModalComponent } from "./ModalComponent";
import { useForm } from "react-hook-form";
import type { CategoryI } from "../interfaces/Category.interfaces";
import { useAlertsService } from "../hooks/useAlerts.service";

export const CategoryList = () => {
  const { categories, create, deleted, update } = useCategoryService();
  const { showAlert } = useAlertsService();
  const [open, setOpen] = useState(false);
  const [atribute, setAtribute] = useState(false);

  const {
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm<Partial<CategoryI>>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSetAtributes = (data: Partial<CategoryI>) => {
    try {
      setAtribute(true);
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("description", data.description);
      handleModalOpen();
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
    reset();
    setAtribute(false);
  };

  const handleCreateCategory = (data: Partial<CategoryI>) => {
    try {
      if (atribute === true) {
        update(`${data.id}`, data);
        reset();
        handleModalClose();
        setAtribute(false);
        showAlert(
          "Category Updated",
          "dark",
          "success",
          "Category updated success!!"
        );
      } else {
        create(data);
        reset();
        handleModalClose();
        setAtribute(false);
        showAlert(
          "Category Created",
          "dark",
          "success",
          "Category created success!!"
        );
      }
    } catch (error) {
      throw new Error(error as string);
    }
  };

  return (
    <>
      <div>
        <ModalComponent
          title={atribute ? "update Category" : "Create Category"}
          content={
            <>
              <form
                onSubmit={handleSubmit(handleCreateCategory)}
                className="grid grid-cols-1 m-4"
              >
                <label className="label text-2xl">name category</label>
                <input
                  className="input w-auto m-4"
                  type="text"
                  placeholder="insert name category"
                  {...register("name", { required: "Name is required" })}
                />
                <span className={errors ? "text-red-500" : ""}>
                  {errors.name?.message}
                </span>
                <label className="label text-2xl">description category</label>
                <input
                  className="input w-auto m-4"
                  type="text"
                  placeholder="insert description category"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                <span className={errors ? "text-red-500" : ""}>
                  {errors.description?.message}
                </span>
                <div className="grid justify-center">
                  <button className="btn btn-primary" type="submit">
                    {atribute ? "update" : "Create"}
                  </button>
                </div>
              </form>
            </>
          }
          onClose={() => handleModalClose()}
          open={open}
        />
        <button onClick={handleModalOpen} className="btn btn-primary m-5">
          add
        </button>

        {categories.length > 0 ? (
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {categories.map((item) => (
                  <tr key={item.id}>
                    <th>{item.id}</th>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td className="grid grid-cols-2 w-60">
                      <button
                        className="btn btn-accent m-2"
                        onClick={() => {
                          handleSetAtributes(item);
                        }}
                      >
                        update
                      </button>
                      <button
                        onClick={() => {
                          deleted(`${item.id}`);
                        }}
                        className="btn btn-error m-2"
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
              <p className="text-4xl">categories not found</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
