import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  MapPin,
  Package,
  Truck,
  CheckCircle,
  Star,
  RefreshCw,
  Calendar,
  Receipt,
  Phone,
  MessageCircle,
  Heart
} from "lucide-react";

interface Order {
  id: string;
  restaurantName: string;
  items: string[];
  total: number;
  status: "preparing" | "ready" | "picked-up" | "delivered";
  estimatedTime: string;
  orderedAt: string;
  calories: number;
  nutritionMatch: number;
}

const Orders = () => {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  const activeOrders: Order[] = [
    {
      id: "ORD001",
      restaurantName: "Green Garden Bistro",
      items: ["Quinoa Power Bowl", "Grilled Salmon Plate"],
      total: 800,
      status: "preparing",
      estimatedTime: "25-30 min",
      orderedAt: "2024-01-14 02:30 PM",
      calories: 850,
      nutritionMatch: 96
    },
    {
      id: "ORD002",
      restaurantName: "Fit Food Co.",
      items: ["Protein Smoothie Bowl"],
      total: 280,
      status: "ready",
      estimatedTime: "Ready for pickup",
      orderedAt: "2024-01-14 01:15 PM",
      calories: 350,
      nutritionMatch: 92
    }
  ];

  const orderHistory: Order[] = [
    {
      id: "ORD003",
      restaurantName: "Spice Route",
      items: ["Dal Tadka with Brown Rice", "Mixed Vegetable Curry"],
      total: 420,
      status: "delivered",
      estimatedTime: "Delivered",
      orderedAt: "2024-01-13 07:30 PM",
      calories: 680,
      nutritionMatch: 78
    },
    {
      id: "ORD004",
      restaurantName: "Green Garden Bistro",
      items: ["Quinoa Power Bowl"],
      total: 350,
      status: "delivered",
      estimatedTime: "Delivered",
      orderedAt: "2024-01-12 12:45 PM",
      calories: 450,
      nutritionMatch: 98
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "preparing":
        return {
          color: "bg-blue-500",
          text: "Preparing",
          icon: <Clock className="h-4 w-4" />,
          progress: 25
        };
      case "ready":
        return {
          color: "bg-yellow-500",
          text: "Ready for Pickup",
          icon: <Package className="h-4 w-4" />,
          progress: 75
        };
      case "picked-up":
        return {
          color: "bg-orange-500",
          text: "On the Way",
          icon: <Truck className="h-4 w-4" />,
          progress: 90
        };
      case "delivered":
        return {
          color: "bg-green-500",
          text: "Delivered",
          icon: <CheckCircle className="h-4 w-4" />,
          progress: 100
        };
      default:
        return {
          color: "bg-gray-500",
          text: "Unknown",
          icon: <Clock className="h-4 w-4" />,
          progress: 0
        };
    }
  };

  const currentOrders = activeTab === "active" ? activeOrders : orderHistory;

  return (
    <div className="min-h-screen bg-gradient-card py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Your <span className="text-primary">Food Orders</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your healthy meals and nutrition progress
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === "active" ? "default" : "ghost"}
              onClick={() => setActiveTab("active")}
              className="px-6"
            >
              Active Orders ({activeOrders.length})
            </Button>
            <Button
              variant={activeTab === "history" ? "default" : "ghost"}
              onClick={() => setActiveTab("history")}
              className="px-6"
            >
              Order History
            </Button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {currentOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            
            return (
              <Card key={order.id} className="shadow-health">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{order.restaurantName}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Receipt className="h-4 w-4" />
                        Order #{order.id}
                        <span className="mx-2">•</span>
                        <Calendar className="h-4 w-4" />
                        {order.orderedAt}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={`${statusInfo.color} text-white`}
                      variant="secondary"
                    >
                      {statusInfo.icon}
                      <span className="ml-2">{statusInfo.text}</span>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Package className="h-4 w-4 mr-2 text-primary" />
                      Order Items
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Health Information */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">₹{order.total}</div>
                        <div className="text-sm text-muted-foreground">Total Amount</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">{order.calories}</div>
                        <div className="text-sm text-muted-foreground">Total Calories</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          <Heart className="h-5 w-5 text-primary mr-2" />
                          <span className="text-2xl font-bold text-primary">{order.nutritionMatch}%</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Diet Plan Match</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Status Progress */}
                  {activeTab === "active" && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Order Progress</span>
                        <span className="text-sm text-muted-foreground">{order.estimatedTime}</span>
                      </div>
                      <Progress value={statusInfo.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>Order Placed</span>
                        <span>Preparing</span>
                        <span>Ready</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end">
                    {activeTab === "active" && (
                      <>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Restaurant
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat Support
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          Track Order
                        </Button>
                      </>
                    )}
                    
                    {activeTab === "history" && (
                      <>
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-2" />
                          Rate Order
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reorder
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {currentOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === "active" ? "No Active Orders" : "No Order History"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === "active" 
                ? "You don't have any active orders right now."
                : "You haven't placed any orders yet."
              }
            </p>
            <Button asChild className="shadow-health">
              <a href="/restaurants">Browse Restaurants</a>
            </Button>
          </div>
        )}

        {/* Nutrition Summary */}
        {currentOrders.length > 0 && (
          <Card className="shadow-health mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary" />
                {activeTab === "active" ? "Today's" : "Recent"} Nutrition Summary
              </CardTitle>
              <CardDescription>
                Track how your orders align with your health goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {currentOrders.reduce((sum, order) => sum + order.calories, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Calories</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round(currentOrders.reduce((sum, order) => sum + order.nutritionMatch, 0) / currentOrders.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Diet Match</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{currentOrders.length}</div>
                  <div className="text-sm text-muted-foreground">Orders</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    ₹{currentOrders.reduce((sum, order) => sum + order.total, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Orders;