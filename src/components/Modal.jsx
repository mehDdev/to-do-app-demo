import React from "react";

export default function TodoModal({
  modal,               // مقدار modal (false، 'add' یا 'edit')
  modalInputRef,       // رفرنس به input داخل modal
  handleModalApply,    // تابع اجرای اعمال (مثلاً ذخیره)
  handleModalCancel,   // تابع لغو مودال
}) {
  if (!modal) return null; // اگر modal غیرفعال بود، چیزی نشون نده

  return (
    <div className={`fixed inset-0 flex justify-center bg-custom-black/70 ${modal ? '' : 'opacity-0 invisible'} transition-all`}>
        {/* Modal */}
        <div className="flex flex-col w-125 h-71.5 mx-5 mt-29.5 py-4.5 px-7.5 bg-custom-white dark:bg-custom-black border border-transparent dark:border-custom-white rounded-2xl">
            <div className="flex flex-col h-full">
            {/* Title */}
            <div>
                <h2 className="text-center text-2xl text-custom-black dark:text-custom-white font-medium">
                {
                modal == 'add' ? 'NEW NOTE' :
                modal == 'edit' ? 'EDIT TODO' :
                ''
                }
                </h2>
            </div>
            {/* Input */}
            <div>
                <input type="text" placeholder="Type..." maxLength={30} className="w-full h-9.5 mt-6.25 py-2.75 px-4 border border-custom-purple dark:border-custom-white rounded-sm text-custom-purple dark:text-custom-white outline-none" 
                ref={modalInputRef }
                onKeyDown={handleModalApply} />
            </div>
            {/* Buttons */}
            <div className="flex justify-between mt-auto">
                <button type="button" className="w-27.5 h-9.5 border-2 border-custom-purple rounded-sm text-lg text-custom-purple font-medium cursor-pointer"
                onClick={handleModalCancel} >
                CENCEL
                </button>
                <button type="button" className="w-27.5 h-9.5 bg-custom-purple rounded-sm text-lg text-custom-white font-medium cursor-pointer" 
                onClick={handleModalApply} >
                APPLY
                </button>
            </div>
            </div>
        </div>
    </div>
  );
}
