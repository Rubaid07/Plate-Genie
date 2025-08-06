import { WandSparkles } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="relative min-h-[calc(100vh-65px)] overflow-hidden flex justify-center items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white">
      </div>
      <div className="absolute top-1/4 -right-20 w-40 h-40 md:w-72 md:h-72 rounded-full bg-green-50/40 blur-xl md:blur-3xl -z-10"></div>
      <div className="relative z-10 flex items-center px-4 sm:px-6 lg:px-12">
        <div className="container mx-auto">
          <div className="flex lg:flex-row items-center gap-8 lg:gap-12 flex-col-reverse">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-snug mb-3 sm:mb-5">
                Smart Meal Planning
                <span className="block text-green-600 mt-2 sm:mt-3">
                  With What You Already Have
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-5 sm:mb-7 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Stop wondering what to cook. PlateGenie creates delicious recipes 
                based on ingredients in your pantry, saving you time and reducing food waste.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  href="/generate-recipe"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-br from-green-600 to-emerald-400 hover:from-emerald-400 hover:to-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <WandSparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  Generate Recipe
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 mt-6 sm:mt-8 lg:mt-0">
              <div>
                <img
                  src="https://i.postimg.cc/yNMt22PT/freepik-background-13903.png"
                  alt="Person cooking with fresh ingredients"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
