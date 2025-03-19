import { Card, CardContent, CardHeader } from '../ui/card'

function LandingSkeletoon() {
  return (
    <>
        {[...Array(4)].map((_, i) => (
                  <Card key={i} className="group">
                    <CardHeader>
                      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
    </>
  )
}

export default LandingSkeletoon
