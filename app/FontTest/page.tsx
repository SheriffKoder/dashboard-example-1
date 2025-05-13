const page = () => {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-background">
        <div className='flex-c-c min-h-[100vh] px-[2rem]'>
            <h1 className='heading1 text-right'>allText.hero.header</h1>
            <p className="signature accent1-t text-right w-full">at your service</p>
        </div>
        
        <div className='flex-c-c min-h-[100vh] px-[2rem]'>
        <p className='heading2 text-right'>allText.hero.paragraph</p>
        <p className='paragraph1 text-right'>allText.hero.paragraph</p>
        <p className="signature text-right w-full">at your service</p>
    
        </div>
    
        <div className="w-full min-h-[100vh] flex-c-c">
            <h1 className="cf1 text-[5rem]">Pierson</h1>
            <p className="cf2 text-[1.5rem]">We are a staffing agency</p>
            <p className="cf3 text-[3rem] accent1-t">at your service</p>
        </div>   
      </div>
  
    )
  }
  
  export default page