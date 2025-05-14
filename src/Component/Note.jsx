import { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  Image,
  Video,
  Save,
  Palette,
  Trash,
  Edit,
  X,
  Check,
  Tag,
  Plus,
  Search,
} from "lucide-react";

// Memoized Navbar component to prevent unnecessary re-renders
const Navbar = memo(({ searchQuery, onSearchChange }) => {
  const searchInputRef = useRef(null);

  return (
    <div className="bg-gray-900 w-full sticky top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-lg p-1 mr-2">
                  <span className="h-8 w-8 flex items-center justify-center text-white font-bold text-xl">
                    <img src="logo1.png" alt="" />
                  </span>
                </div>
                <span className="font-bold text-xl text-white hidden sm:block">
                  Simple Note
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar - Now controlled locally */}
          <div className="relative w-full max-w-md mx-4 transition-all duration-300">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-gray-800 border border-transparent focus:border-blue-500 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Profile Button */}
          <div className="flex items-center">
            <div>
              <button className="flex items-center bg-gray-800 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 p-1">
                <span className="sr-only">User profile</span>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  U
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Memoized Categories component
const Categories = memo(
  ({
    categories,
    selectedCategory,
    onCategoryChange,
    showAddCategory,
    newCategory,
    onNewCategoryChange,
    onAddCategory,
    onToggleAddCategory,
  }) => {
    const addCategoryInputRef = useRef(null);

    useEffect(() => {
      if (showAddCategory && addCategoryInputRef.current) {
        addCategoryInputRef.current.focus();
      }
    }, [showAddCategory]);

    return (
      <div className="mb-6 mt-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Categories</h2>
          <button
            onClick={onToggleAddCategory}
            className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 
              ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {showAddCategory && (
          <div className="mt-3 flex items-center">
            <input
              ref={addCategoryInputRef}
              type="text"
              value={newCategory}
              onChange={(e) => onNewCategoryChange(e.target.value)}
              placeholder="New category name"
              className="flex-grow bg-gray-800 border border-gray-700 text-white rounded-l-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") onAddCategory();
              }}
              onBlur={(e) => {
                if (!e.relatedTarget?.closest('button[type="button"]')) {
                  onToggleAddCategory(false);
                }
              }}
            />
            <button
              onClick={onAddCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
              disabled={!newCategory.trim()}
            >
              Add
            </button>
          </div>
        )}
      </div>
    );
  }
);

const Note = () => {
  // State initialization with localStorage fallback
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [selectedBackground, setSelectedBackground] = useState(
    "bg-gradient-to-br from-gray-800 to-gray-900"
  );
  const [showBackgroundOptions, setShowBackgroundOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editBackground, setEditBackground] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editVideo, setEditVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories
      ? JSON.parse(savedCategories)
      : ["All", "Work", "Personal", "Ideas"];
  });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [editCategory, setEditCategory] = useState("");

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  const editVideoInputRef = useRef(null);
  const modalRef = useRef(null);

  // Background options with gradients
  const backgroundOptions = [
    "bg-gradient-to-br from-gray-800 to-gray-900",
    "bg-gradient-to-br from-blue-800 to-blue-900",
    "bg-gradient-to-br from-green-800 to-green-900",
    "bg-gradient-to-br from-purple-800 to-purple-900",
    "bg-gradient-to-br from-red-800 to-red-900",
    "bg-gradient-to-br from-yellow-800 to-yellow-900",
  ];

  // Save notes and categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [notes, categories]);

  // Filter notes based on search query and selected category
  useEffect(() => {
    let filtered = [...notes];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          (note.title && note.title.toLowerCase().includes(query)) ||
          (note.content && note.content.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((note) => note.category === selectedCategory);
    }

    setFilteredNotes(filtered);
  }, [searchQuery, selectedCategory, notes]);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowViewModal(false);
        setShowEditModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSaveNote = useCallback(() => {
    if (title.trim() === "" && content.trim() === "") {
      return;
    }

    const newNote = {
      id: Date.now(),
      title,
      content,
      background: selectedBackground,
      timestamp: new Date().toLocaleString(),
      image: selectedImage,
      video: selectedVideo,
      category: selectedCategory === "All" ? "Uncategorized" : selectedCategory,
    };

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
    setSelectedImage(null);
    setSelectedVideo(null);
    setSelectedBackground("bg-gradient-to-br from-gray-800 to-gray-900");
  }, [
    title,
    content,
    selectedBackground,
    selectedImage,
    selectedVideo,
    selectedCategory,
    notes,
  ]);

  const handleDeleteNote = useCallback((id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleVideoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedVideo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const openViewModal = useCallback((note) => {
    setCurrentNote(note);
    setShowViewModal(true);
  }, []);

  const openEditModal = useCallback((note) => {
    setCurrentNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditBackground(note.background);
    setEditImage(note.image);
    setEditVideo(note.video);
    setEditCategory(note.category || "Uncategorized");
    setShowEditModal(true);
  }, []);

  const handleEditImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleEditVideoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditVideo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUpdateNote = useCallback(() => {
    if (editTitle.trim() === "" && editContent.trim() === "") {
      return;
    }

    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === currentNote.id) {
          return {
            ...note,
            title: editTitle,
            content: editContent,
            background: editBackground,
            image: editImage,
            video: editVideo,
            category: editCategory,
            timestamp: new Date().toLocaleString() + " (edited)",
          };
        }
        return note;
      })
    );
    setShowEditModal(false);
  }, [
    currentNote?.id,
    editTitle,
    editContent,
    editBackground,
    editImage,
    editVideo,
    editCategory,
  ]);

  const handleAddCategory = useCallback(() => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory.trim())) {
      setCategories((prev) => [...prev, newCategory.trim()]);
      setSelectedCategory(newCategory.trim());
      setNewCategory("");
      setShowAddCategory(false);
    }
  }, [newCategory, categories]);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleNewCategoryChange = useCallback((value) => {
    setNewCategory(value);
  }, []);

  const toggleAddCategory = useCallback(() => {
    setShowAddCategory((prev) => !prev);
  }, []);

  const truncateText = useCallback((text, lines = 2) => {
    if (!text) return "";
    const words = text.split(" ");
    const limit = lines * 10;
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }
    return text;
  }, []);

  return (
    <div className="bg-gray-950 min-h-screen">
      <Navbar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <div className="max-w-6xl mx-auto px-4 py-4">
        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          showAddCategory={showAddCategory}
          newCategory={newCategory}
          onNewCategoryChange={handleNewCategoryChange}
          onAddCategory={handleAddCategory}
          onToggleAddCategory={toggleAddCategory}
        />

        {/* Note Input Box */}
        <div className="max-w-3xl mx-auto mb-8">
          <div
            className={`rounded-lg p-6 shadow-lg ${selectedBackground} text-white transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-0.5`}
          >
            <div className="flex items-center mb-3">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xl font-medium placeholder-gray-400"
              />
              <div className="ml-2 flex items-center bg-black bg-opacity-30 rounded-full px-3 py-1">
                <Tag size={14} className="mr-1 text-gray-300" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-gray-300"
                >
                  {categories.map((category, index) => (
                    <option
                      key={index}
                      value={category}
                      className="bg-gray-800 text-white"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              placeholder="Write a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 bg-transparent border-none outline-none resize-none placeholder-gray-400 text-sm"
            />

            {/* Preview uploaded image */}
            {selectedImage && (
              <div className="relative mt-2 mb-3">
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="max-h-40 rounded-md w-auto object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-1 right-1 bg-black bg-opacity-70 rounded-full p-1 text-white"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Preview uploaded video */}
            {selectedVideo && (
              <div className="relative mt-2 mb-3">
                <video
                  src={selectedVideo}
                  controls
                  className="max-h-40 rounded-md w-full"
                />
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-1 right-1 bg-black bg-opacity-70 rounded-full p-1 text-white"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-3">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-all"
                  title="Add image"
                >
                  <Image size={20} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  onClick={() => videoInputRef.current.click()}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-all"
                  title="Add video"
                >
                  <Video size={20} />
                </button>
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoUpload}
                  accept="video/*"
                  className="hidden"
                />

                <div className="relative">
                  <button
                    onClick={() =>
                      setShowBackgroundOptions(!showBackgroundOptions)
                    }
                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-all"
                    title="Change background"
                  >
                    <Palette size={20} />
                  </button>

                  {showBackgroundOptions && (
                    <div className="absolute bottom-12 left-0 flex space-x-2 p-3 bg-gray-900 rounded-lg shadow-xl z-10">
                      {backgroundOptions.map((bg, index) => (
                        <button
                          key={index}
                          className={`w-7 h-7 rounded-full ${bg} border-2 hover:scale-110 transition-transform ${
                            selectedBackground === bg
                              ? "border-white"
                              : "border-transparent"
                          }`}
                          onClick={() => {
                            setSelectedBackground(bg);
                            setShowBackgroundOptions(false);
                          }}
                          title={`Background ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleSaveNote}
                disabled={!title.trim() && !content.trim()}
                className={`px-4 py-2 rounded-md flex items-center transition-all shadow-lg ${
                  !title.trim() && !content.trim()
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5"
                }`}
              >
                <Save size={18} className="mr-1.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              {selectedCategory === "All"
                ? searchQuery
                  ? `Search Results (${filteredNotes.length})`
                  : "All Notes"
                : selectedCategory}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`${
                    note.background ||
                    "bg-gradient-to-br from-gray-800 to-gray-900"
                  } rounded-lg p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-white cursor-pointer`}
                  onClick={() => openViewModal(note)}
                >
                  {/* Note Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium mb-1 line-clamp-1">
                        {note.title || "Untitled"}
                      </h3>
                      <div className="flex items-center text-xs text-gray-400 mb-2">
                        <Tag size={12} className="mr-1" />
                        <span>{note.category || "Uncategorized"}</span>
                      </div>
                    </div>
                    <div
                      className="flex space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                        title="Delete note"
                      >
                        <Trash size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(note);
                        }}
                        className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                        title="Edit note"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Note Content Preview - Truncated */}
                  <div className="whitespace-pre-wrap break-words line-clamp-2 text-sm text-gray-200 mt-1">
                    {truncateText(note.content)}
                  </div>

                  {/* Note Media Preview */}
                  {(note.image || note.video) && (
                    <div className="mt-3 overflow-hidden">
                      {note.image && (
                        <img
                          src={note.image}
                          alt="Note"
                          className="h-24 w-full object-cover rounded"
                        />
                      )}
                      {note.video && !note.image && (
                        <video
                          src={note.video}
                          className="h-24 w-full object-cover rounded"
                        />
                      )}
                    </div>
                  )}

                  {/* Note Timestamp */}
                  <div className="text-xs text-gray-400 mt-3">
                    {note.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-900 bg-opacity-50 rounded-lg">
            <div className="text-gray-400 mb-4">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              No notes found
            </h3>
            <p className="text-gray-400">
              {searchQuery
                ? "Try a different search term or category"
                : "Create your first note to get started"}
            </p>
          </div>
        )}
      </div>

      {/* View Note Modal */}
      {showViewModal && currentNote && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4 backdrop-blur-sm">
          <div
            ref={modalRef}
            className={`${
              currentNote.background ||
              "bg-gradient-to-br from-gray-800 to-gray-900"
            } rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {currentNote.title || "Untitled"}
                </h2>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <Tag size={14} className="mr-1" />
                  <span>{currentNote.category || "Uncategorized"}</span>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="whitespace-pre-wrap break-words text-white my-4">
              {currentNote.content}
            </div>

            {currentNote.image && (
              <div className="mb-4">
                <img
                  src={currentNote.image}
                  alt="Note"
                  className="w-full rounded-md"
                />
              </div>
            )}

            {currentNote.video && (
              <div className="mb-4">
                <video
                  src={currentNote.video}
                  controls
                  className="w-full rounded-md"
                />
              </div>
            )}

            <div className="text-sm text-gray-400 mt-4">
              {currentNote.timestamp}
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {showEditModal && currentNote && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4 backdrop-blur-sm">
          <div
            ref={modalRef}
            className={`${
              editBackground || "bg-gradient-to-br from-gray-800 to-gray-900"
            } rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl`}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">Edit Note</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center mb-3">
              <input
                type="text"
                placeholder="Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-lg font-medium text-white placeholder-gray-400"
              />
              <div className="ml-2 flex items-center bg-black bg-opacity-30 rounded-full px-3 py-1">
                <Tag size={14} className="mr-1 text-gray-300" />
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-gray-300"
                >
                  <option
                    value="Uncategorized"
                    className="bg-gray-800 text-white"
                  >
                    Uncategorized
                  </option>
                  {categories
                    .filter((cat) => cat !== "All")
                    .map((category, index) => (
                      <option
                        key={index}
                        value={category}
                        className="bg-gray-800 text-white"
                      >
                        {category}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <textarea
              placeholder="Write a note..."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-32 bg-transparent border-none outline-none resize-none text-white placeholder-gray-400"
              rows={6}
            />

            {/* Edit image preview */}
            {editImage && (
              <div className="relative mt-3 mb-3">
                <img
                  src={editImage}
                  alt="Uploaded"
                  className="max-h-60 rounded-md w-auto object-contain"
                />
                <button
                  onClick={() => setEditImage(null)}
                  className="absolute top-1 right-1 bg-black bg-opacity-70 rounded-full p-1 text-white"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Edit video preview */}
            {editVideo && (
              <div className="relative mt-3 mb-3">
                <video
                  src={editVideo}
                  controls
                  className="max-h-60 rounded-md w-full"
                />
                <button
                  onClick={() => setEditVideo(null)}
                  className="absolute top-1 right-1 bg-black bg-opacity-70 rounded-full p-1 text-white"
                  title="Remove video"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-3 mt-4 mb-6">
              <button
                onClick={() => editFileInputRef.current.click()}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition"
                title="Add image"
              >
                <Image size={20} />
              </button>
              <input
                type="file"
                ref={editFileInputRef}
                onChange={handleEditImageUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                onClick={() => editVideoInputRef.current.click()}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition"
                title="Add video"
              >
                <Video size={20} />
              </button>
              <input
                type="file"
                ref={editVideoInputRef}
                onChange={handleEditVideoUpload}
                accept="video/*"
                className="hidden"
              />

              <div className="flex space-x-2">
                {backgroundOptions.map((bg, index) => (
                  <button
                    key={index}
                    className={`w-6 h-6 rounded-full ${bg} border hover:scale-110 transition-transform ${
                      editBackground === bg
                        ? "border-white"
                        : "border-transparent"
                    }`}
                    onClick={() => setEditBackground(bg)}
                    title={`Background ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNote}
                disabled={!editTitle.trim() && !editContent.trim()}
                className={`px-4 py-2 rounded-md flex items-center transition shadow-md ${
                  !editTitle.trim() && !editContent.trim()
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                }`}
              >
                <Check size={18} className="mr-1.5" />
                <span>Update</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Note;
