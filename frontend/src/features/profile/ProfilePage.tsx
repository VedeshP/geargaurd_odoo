import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/stores/user-store'
import { ArrowLeft, Mail, Shield, User } from 'lucide-react'
import { useState } from 'react'

interface ProfilePageProps {
  onBack: () => void
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const currentUser = useUserStore((state) => state.currentUser)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  })

  const handleSave = () => {
    // TODO: Implement profile update API call
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-purple-900/30 text-purple-300 border-purple-700'
      case 'technician':
        return 'bg-blue-900/30 text-blue-300 border-blue-700'
      case 'user':
        return 'bg-green-900/30 text-green-300 border-green-700'
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white">User Profile</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your account information and preferences
                </CardDescription>
              </div>
              <div className="bg-slate-800 p-4 rounded-full">
                <User className="h-10 w-10 text-slate-300" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </h3>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="bg-slate-800 border-slate-700 text-white disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10 bg-slate-800 border-slate-700 text-white disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Role</Label>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-slate-500" />
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(
                        currentUser?.role || 'user'
                      )}`}
                    >
                      {currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'User'}
                    </span>
                  </div>
                </div>

                {currentUser?.company && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Company</Label>
                    <Input
                      value={currentUser.company}
                      disabled
                      className="bg-slate-800 border-slate-700 text-white disabled:opacity-60"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-800">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({
                        name: currentUser?.name || '',
                        email: currentUser?.email || '',
                      })
                    }}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription className="text-slate-400">
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">User ID</span>
              <span className="text-slate-300 font-mono">{currentUser?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Account Status</span>
              <span className="text-green-400 font-medium">Active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
