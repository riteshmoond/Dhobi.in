import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const AdminRatings = ({ ratings, deleteRating }) => {
  return (
    <section className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Stats */}
      <div>
        {Array.from({ length: 5 }, (_, i) => {
          const count = ratings.filter(r => r.rating === 5 - i).length;
          const percentage = ratings.length > 0 ? Math.round((count / ratings.length) * 100) : 0;
          return (
            <div key={i} className="flex items-center gap-3 mb-2">
              <div className="flex gap-1 w-20">
                {Array.from({ length: 5 - i }, () => '⭐')}
              </div>
              <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-slate-300 w-12 text-right">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-2 sm:space-y-3 max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh] overflow-y-auto scrollbar-hide">
        {ratings.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg font-semibold">⭐ No reviews yet</p>
            <p className="text-slate-500 mt-2">Customer reviews will appear here</p>
          </div>
        ) : (
          ratings.map((rating) => (
            <div 
              key={rating.id}
              className="group relative bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-5 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/0 to-orange-600/0 group-hover:from-yellow-600/10 group-hover:to-orange-600/10 rounded-xl transition-all"></div>
              
              <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-black text-lg text-yellow-300">👤 {rating.customerName || "Anonymous"}</p>
                    <span className="text-2xl flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        i < (rating.rating || 0) ? '⭐' : '☆'
                      ))}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">"{rating.review || "No written comment"}"</p>
                  <p className="text-xs text-slate-500 mt-2">
                    📅 {new Date(rating.date || Date.now()).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    if (window.confirm("Delete this review?")) {
                      deleteRating(rating.id);
                    }
                  }}
                  className="bg-red-600/80 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 gap-2 whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default AdminRatings;
