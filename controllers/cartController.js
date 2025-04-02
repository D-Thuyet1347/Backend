import userModel from "../models/userModel.js"

const addTocart=async(req,res)=>{
      try {
        let userData=await userModel.findOne({_id:req.body.userId})
        let cartData=await userData.cartData;
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId]=1
        }
        else
        {
            cartData[req.body.itemId] +=1
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData})
        res.json({success:true,message:"added to cart"});
      } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"});

        
      }
}
// bỏ 1 sp
const decreaseTocart =async(req,res)=>
    {
        try {
            let userData=await userModel.findOne({_id:req.body.userId})
            let cartData=await userData.cartData;
            if(cartData[req.body.itemId]>0)
            {
                cartData[req.body.itemId] -= 1
            }
            await userModel.findByIdAndUpdate(req.body.userId,{cartData})
            res.json({success:true,message:"Remove from Cart"});
        } catch (error) {
            console.log(error);
            res.json({success:false,message:"error"})
        }
    }

//remove item from 
const removeFromCart = async (req, res) => {
    try {
        
        let userData = await userModel.findOne({ _id: req.body.userId });
        
        let cartData = userData.cartData || {}; 
        if (cartData[req.body.itemId]) {
            delete cartData[req.body.itemId];
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing item from cart" });
    }
};


const getCart=async(req,res)=>{
    try {
        let userData=await userModel.findOne({_id:req.body.userId})
        let cartData=await userData.cartData;
        res.json({success:true,cartData});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

export {addTocart,decreaseTocart,removeFromCart,getCart}