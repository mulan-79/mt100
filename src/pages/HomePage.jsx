import { FAQ } from '../components/FAQ'
import { GearShowcase } from '../components/GearShowcase'
import { MountainChallengeInfo } from '../components/MountainChallengeInfo'
import { ReviewList } from '../components/ReviewList'
import { Hero } from '../components/sections/Hero'
import { MountainProgressBar } from '../components/sections/MountainProgressBar'
import { NextRecommendedPeaks } from '../components/sections/NextRecommendedPeaks'

/** 전체 섹션을 한 페이지에 표시 */
export function HomePage() {
  return (
    <>
      <Hero />
      <MountainProgressBar />
      <MountainChallengeInfo />
      <NextRecommendedPeaks />
      <ReviewList />
      <GearShowcase />
      <FAQ />
    </>
  )
}
