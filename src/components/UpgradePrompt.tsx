import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Star, ArrowRight } from "lucide-react"
import { UserType, getUpgradeSuggestion, pricingPlans } from "@/lib/user-tiers"

interface UpgradePromptProps {
  userType: UserType
  feature?: string
  className?: string
  compact?: boolean
}

export function UpgradePrompt({ userType, feature, className = "", compact = false }: UpgradePromptProps) {
  const suggestion = getUpgradeSuggestion(userType, feature)
  
  if (!suggestion || userType === UserType.PREMIUM) {
    return null
  }

  if (compact) {
    return (
      <div className={`bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg text-white ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            <span className="text-sm font-medium">{suggestion.title}</span>
          </div>
          <Button variant="secondary" size="sm" className="text-purple-600">
            {suggestion.action}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className={`border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
            <Crown className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{suggestion.title}</h3>
              {userType === UserType.ANONYMOUS && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  免费
                </Badge>
              )}
              {suggestion.nextTier === UserType.PREMIUM && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  $29/月
                </Badge>
              )}
            </div>
            
            <p className="text-gray-600 mb-4">{suggestion.description}</p>
            
            {/* 功能列表 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {userType === UserType.ANONYMOUS && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span>Flux Kontext Max模型</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Star className="h-4 w-4 text-purple-500" />
                    <span>生成1-4张图片</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Crown className="h-4 w-4 text-purple-500" />
                    <span>历史记录同步</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <ArrowRight className="h-4 w-4 text-purple-500" />
                    <span>更多宽高比选项</span>
                  </div>
                </>
              )}
              
              {userType === UserType.REGISTERED && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Crown className="h-4 w-4 text-purple-500" />
                    <span>批量生成1-12张</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span>Private Mode私人模式</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Star className="h-4 w-4 text-purple-500" />
                    <span>优先队列快速生成</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <ArrowRight className="h-4 w-4 text-purple-500" />
                    <span>无限制使用频率</span>
                  </div>
                </>
              )}
            </div>
            
            {/* 特殊优惠 */}
            {suggestion.nextTier === UserType.PREMIUM && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    年付方案节省20% - 仅需$290/年
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              {userType === UserType.ANONYMOUS && (
                <Button variant="outline" className="flex-1">
                  免费注册
                </Button>
              )}
              <Button 
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {suggestion.action}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 功能锁定提示组件
interface FeatureLockedProps {
  userType: UserType
  feature: string
  requiredTier: UserType
  className?: string
}

export function FeatureLocked({ userType, feature, requiredTier, className = "" }: FeatureLockedProps) {
  const tierNames = {
    [UserType.ANONYMOUS]: "免费用户",
    [UserType.REGISTERED]: "注册用户", 
    [UserType.PREMIUM]: "Premium用户"
  }
  
  return (
    <div className={`bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center ${className}`}>
      <Crown className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <h4 className="font-medium text-gray-700 mb-1">{feature}</h4>
      <p className="text-sm text-gray-500 mb-3">
        此功能需要{tierNames[requiredTier]}权限
      </p>
      <UpgradePrompt userType={userType} feature={feature} compact />
    </div>
  )
}

// 使用量提示组件
interface UsageLimitProps {
  current: number
  limit: number
  period: string
  userType: UserType
}

export function UsageLimit({ current, limit, period, userType }: UsageLimitProps) {
  const percentage = (current / limit) * 100
  const isNearLimit = percentage >= 80
  const isOverLimit = current >= limit
  
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          使用量 ({period})
        </span>
        <span className="text-sm text-gray-500">
          {current} / {limit === Infinity ? '∞' : limit}
        </span>
      </div>
      
      {limit !== Infinity && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className={`h-2 rounded-full transition-all ${
              isOverLimit ? 'bg-red-500' : 
              isNearLimit ? 'bg-yellow-500' : 
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
      
      {isOverLimit && (
        <div className="text-sm text-red-600 mb-2">
          已达到使用限制，请升级账户继续使用
        </div>
      )}
      
      {isNearLimit && !isOverLimit && (
        <div className="text-sm text-yellow-600 mb-2">
          即将达到使用限制，建议升级账户
        </div>
      )}
      
      {(isNearLimit || isOverLimit) && userType !== UserType.PREMIUM && (
        <UpgradePrompt userType={userType} compact />
      )}
    </div>
  )
} 