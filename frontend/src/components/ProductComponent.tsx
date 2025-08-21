import { useState } from "react";
import { useProductService } from "../hooks/useProduct.service";
import { ModalComponent } from "./ModalComponent";
import { useSubCategoryService } from "../hooks/useSubCategory.service";
import { useForm } from "react-hook-form";
import type { ProductInterface } from "../interfaces/Product.interface";

export const ProductComponent = () => {
  const { products, create, updated, deleted } = useProductService();
  const { subCategories } = useSubCategoryService();

  const [open, setOpen] = useState(false);

  const [atribute, setAtribute] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Partial<ProductInterface>>({
    defaultValues: {
      image: "",
      name: "",
      description: "",
      price: 0,
      amount: 0,
      subcategoriesid: 0,
    },
  });

  const handleUpdateAtribute = (item: Partial<ProductInterface>) => {
    try {
      setValue("id", item.id);
      setValue("image", item.image);
      setValue("name", item.name);
      setValue("description", item.description);
      setValue("price", item.price);
      setValue("amount", item.amount);
      setValue("subcategoriesid", item.subcategoriesid);
      setAtribute(true);
      handleOpenModal();
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setAtribute(false);
    reset();
  };

  const handleCreateUpdateSubmit = (data: Partial<ProductInterface>) => {
    try {
      if (atribute === true) {
        updated(`${data.id}`, data);
        setAtribute(false);
        handleCloseModal();
        reset();
      } else {
        create(data);
        setAtribute(false);
        handleCloseModal();
        reset();
      }
    } catch (error) {
      throw new Error(error as string);
    }
  };

  return (
    <>
      <div>
        <div className="pb-10">
          <ModalComponent
            onClose={handleCloseModal}
            open={open}
            title={atribute ? "update product" : "Create Product"}
            content={
              <>
                <form
                  onSubmit={handleSubmit(handleCreateUpdateSubmit)}
                  className="grid grid-cols-1"
                >
                  <label>add image</label>
                  <input
                    type="text"
                    placeholder="add image"
                    className="m-4 input w-auto"
                    {...register("image", { required: "image is required" })}
                  />
                  <span className={errors ? "text-error" : ""}>
                    {errors.image?.message}
                  </span>
                  <label>add name</label>

                  <input
                    type="text"
                    placeholder="add name"
                    className="m-4 input w-auto"
                    {...register("name", { required: "name is required" })}
                  />
                  <span className={errors ? "text-error" : ""}>
                    {errors.name?.message}
                  </span>
                  <label>add description</label>
                  <input
                    type="text"
                    placeholder="add description"
                    className="m-4 input w-auto"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                  <span className={errors ? "text-error" : ""}>
                    {errors.description?.message}
                  </span>
                  <label>add price</label>
                  <input
                    type="text"
                    placeholder="add price"
                    className="m-4 input w-auto"
                    {...register("price", { required: "price is required" })}
                  />
                  <span className={errors ? "text-error" : ""}>
                    {errors.price?.message}
                  </span>
                  <label>add amount</label>
                  <input
                    type="number"
                    placeholder="add amount"
                    className="m-4 input w-auto"
                    {...register("amount", { required: "amount is required" })}
                  />
                  <span className={errors ? "text-error" : ""}>
                    {errors.amount?.message}
                  </span>
                  <select
                    className="select m-4 mb-10"
                    {...register("subcategoriesid", {
                      required: "subcategory is required",
                    })}
                  >
                    {subCategories.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <span className={errors ? "text-error" : ""}>
                    {errors.subcategoriesid?.message}
                  </span>

                  <div className="justify-end">
                    <button type="submit" className="btn btn-accent">
                      {atribute ? "update" : "Create"}
                    </button>
                  </div>
                </form>
              </>
            }
          />
          <button onClick={handleOpenModal} className="btn btn-primary">
            add
          </button>
        </div>

        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>image</th>
                <th>Name</th>
                <th>description</th>
                <th>price</th>
                <th>amount</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}

              {products.map((item) => (
                <tr key={item.id}>
                  <th><img
                    src={item.image}
                    alt={item.name}
                    height="10px"
                    width="100px"
                  /></th>
                  <th>{item.name}</th>
                  <th>{item.description}</th>
                  <th>$ {item.price}</th>
                  <th>{item.amount}</th>
                  <th>
                    <button
                      onClick={() => handleUpdateAtribute(item)}
                      className="m-4 btn btn-accent"
                    >
                      update
                    </button>
                    <button
                      onClick={() => deleted(`${item.id}`)}
                      className="m-4 btn btn-error"
                    >
                      delete
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
