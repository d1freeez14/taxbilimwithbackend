import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const textSlides = [
  {
    title: 'Все удобства для комфортного обучения на главной странице',
    desc: 'Просматривайте топ курсы месяца, отслеживайте свой прогресс в обучении и приобретайте новые курсы',
  },
  {
    title: 'Новый уровень интерактивного образования',
    desc: 'Участвуйте в живых вебинарах и получайте обратную связь от экспертов в реальном времени',
  },
  {
    title: 'Персональная траектория роста',
    desc: 'Соберите свой учебный план из рекомендаций нашего AI-ассистента и достигайте целей быстрее',
  },
]

const TextSlider = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    paddingRight: 64,
  }

  return (
    <Slider {...settings}>
      {textSlides.map((slide, i) => (
        <div key={i} className="text-center text-white">
          <h2 className="text-[36px] font-semibold">{slide.title}</h2>
          <p className="text-[18px]">
            {slide.desc}
          </p>
        </div>
      ))}
    </Slider>
  )
}
export default TextSlider;