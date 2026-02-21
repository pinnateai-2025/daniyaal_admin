import React, { useEffect, useState, DragEvent } from "react";
import apiClient from "../api/axios";
import { useNavigate } from "react-router-dom";

export function ProductForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [size, setSize] = useState("");
  const [fragranceNotes, setFragranceNotes] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  const discount =
    mrp && price
      ? Math.max(0, Math.round(((+mrp - +price) / +mrp) * 100))
      : 0;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await apiClient.get("/category");
    setCategories(data);
  };

  /* ==============================
     IMAGE HANDLING
  ===============================*/

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    setImages((prev) => [...prev, ...fileArray]);

    const previews = fileArray.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  /* ==============================
     CATEGORY CREATE
  ===============================*/

  const createCategory = async () => {
    if (!newCategory) return;

    try {
      const { data } = await apiClient.post("/category", {
        name: newCategory,
      });

      setCategoryId(data.id);
      setShowCategoryInput(false);
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      alert("Failed to create category");
    }
  };

  /* ==============================
     SUBMIT
  ===============================*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("mrp", mrp);
    formData.append("stock", stock);
    formData.append("categoryId", categoryId);
    formData.append("size", size);
    formData.append("fragranceNotes", fragranceNotes);

    images.forEach((img) => {
      formData.append("images", img);
    });

    await apiClient.post("/product", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/products");
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8">Create Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* PRODUCT NAME */}
        <input
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#e7b008]"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* DESCRIPTION */}
        <textarea
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#e7b008]"
          placeholder="Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* PRICE + MRP */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Selling Price"
            className="border p-3 rounded-lg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="MRP"
            className="border p-3 rounded-lg"
            value={mrp}
            onChange={(e) => setMrp(e.target.value)}
          />
        </div>

        {discount > 0 && (
          <div className="text-green-600 font-semibold">
            {discount}% Discount Preview
          </div>
        )}

        {/* SIZE */}
        <input
          type="text"
          placeholder="Size (10ml, 20ml)"
          className="border p-3 rounded-lg w-full"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />

        {/* FRAGRANCE NOTES */}
        <input
          type="text"
          placeholder="Fragrance Notes"
          className="border p-3 rounded-lg w-full"
          value={fragranceNotes}
          onChange={(e) => setFragranceNotes(e.target.value)}
        />

        {/* STOCK */}
        <input
          type="number"
          placeholder="Stock"
          className="border p-3 rounded-lg w-full"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        {/* CATEGORY */}
        <div>
          {!showCategoryInput ? (
            <select
              className="border p-3 rounded-lg w-full"
              value={categoryId}
              onChange={(e) => {
                if (e.target.value === "new") {
                  setShowCategoryInput(true);
                } else {
                  setCategoryId(e.target.value);
                }
              }}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value="new">+ Create New Category</option>
            </select>
          ) : (
            <div className="flex gap-3">
              <input
                className="border p-3 rounded-lg flex-1"
                placeholder="New Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                type="button"
                onClick={createCategory}
                className="bg-[#e7b008] px-4 rounded-lg font-semibold"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* IMAGE UPLOAD */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer"
        >
          <p className="text-gray-500">
            Drag & Drop images here or click to upload
          </p>
          <input
            type="file"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="imageUpload"
          />
          <label
            htmlFor="imageUpload"
            className="mt-3 inline-block bg-[#e7b008] px-4 py-2 rounded cursor-pointer"
          >
            Choose Files
          </label>
        </div>

        {/* IMAGE PREVIEW */}
        <div className="grid grid-cols-4 gap-4">
          {previewImages.map((src, index) => (
            <div key={index} className="relative">
              <img
                src={src}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded-full text-xs"
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="bg-[#e7b008] hover:bg-[#c39500] text-black font-semibold px-8 py-3 rounded-lg transition w-full"
        >
          + Add Product
        </button>
      </form>
    </div>
  );
}