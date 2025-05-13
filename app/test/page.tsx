import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-black gap-[2rem] p-[2rem]'>
        {/* Text shadow */}
      <h1 className='text-4xl font-bold text-shadow-sm/5 text-white text-shadow-[#000000]'>Hello World</h1>

    {/* masking */}
    <div className='w-[500px] h-[500px] bg-purple-500 rounded-xl flex items-center justify-center border
    mask-r-from-70% mask-r-to-120% 
    mask-b-from-50% mask-b-to-100%'>
        <h1 className='text-4xl font-bold text-white text-shadow-sm/5 text-shadow-[#000000]'>Hello World</h1>
    </div>

    <div className='w-[500px] h-[500px] bg-purple-500 rounded-xl flex items-center justify-center border
    mask-radial-from-0% mask-radial-to-80%'>
        <h1 className='text-4xl font-bold text-white text-shadow-sm/5 text-shadow-[#000000]'>Radial 0 to 80</h1>
    </div>

    <div className='w-[500px] h-[500px] bg-purple-500 rounded-xl flex items-center justify-center border
    mask-radial-from-0% mask-radial-closest-side'>
        <h1 className='text-4xl font-bold text-white text-shadow-sm/5 text-shadow-[#000000]'>Radial closest side</h1>
    </div>

    <div className='w-[500px] h-[500px] bg-purple-500 rounded-xl flex items-center justify-center border
    mask-radial-from-0% mask-radial-farthest-side'>
        <h1 className='text-4xl font-bold text-white text-shadow-sm/5 text-shadow-[#000000]'>Radial farthest side</h1>
    </div>

    <div className='w-[500px] h-[500px] bg-purple-500 rounded-xl flex items-center justify-center perspective-distant
    mask-radial-from-0% mask-radial-at-top-left mask-b-from-50% mask-b-to-130%'>
        <h1 className='text-4xl font-bold text-white text-shadow-sm/5 text-shadow-[#000000] rotate-y-51 transform-3d'>Radial at top left</h1>
    </div>

    {/* Peer */}
    <div className='flex flex-row gap-[2rem]'>
        <div className='h-[200px] w-[200px] bg-purple-500 peer peer-hover:bg-red-500 rounded-xl flex items-center justify-center border'>
            <h1 className='text-4xl font-bold text-white text-shadow-sm/5 text-shadow-[#000000]'>Hello World</h1>
        </div>

        <div className='h-[200px] w-[200px] bg-purple-500 rounded-xl peer-hover:bg-red-500 flex items-center justify-center border'>
            <h1 className='text-4xl font-bold text-white text-shadow-sm/5 text-shadow-[#000000]'>Hello World</h1>
        </div>
    </div>

    <div className='h-[200px] w-[200px] shadow-[0_0_20px_purple] rounded-xl md2:shadow-[0_0_20px_red] flex items-center justify-center'>
        <h1 className='text-4xl font-bold text-white text-shadow-sm/5 text-shadow-[#000000]'>Hello World</h1>
    </div>

    <div className='h-[200px] w-[200px] rounded-xl flex items-center justify-center drop-shadow-xl drop-shadow-indigo-500/50 bg-indigo-500'>
        <h1 className='text-4xl font-bold text-white text-shadow-sm/5 text-shadow-[#000000]'>Drop shadow</h1>
    </div>

    <div className="grid grid-cols-[1fr_auto] items-baseline-lasts w-[500px] h-[200px] bg-zinc-900 rounded-xl">
        <div>
            <div className='w-full h-[100px] bg-purple-500 rounded-xl'></div>
            <h4>Items baseline last</h4>
            <p>Working on the future of astronaut recruitment at Space Recruit.</p>
        </div>
        <p className='self-baseline-last'>self-baseline-last</p>
    </div>

    <details className="rounded-lg border border-transparent p-6 details-content:mt-3 details-content:-ml-0.5" open>
        <summary className="text-sm leading-6 font-semibold text-gray-900 select-none dark:text-white">
            Why do they call it Ovaltine?
        </summary>
        <div className="border-gray-200/10 border bg-gray-50/10 py-3 pl-3 rounded-xl ...">
            <p>The mug is round. The jar is round. They should call it Roundtine.</p>
        </div>
    </details>

    <input required className="border user-valid:border-green-500" />
    <input type='email' required className="border user-invalid:border-red-500" />

    <button className="text-white text-shadow-2xs rounded-xl p-[1rem] font-bold bg-linear-gradient-to-r from-gray-500 50% to-gray-700">See pricing</button>




    </div>
  )
}

export default page
