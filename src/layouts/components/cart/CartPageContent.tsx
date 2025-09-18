"use client";

import { DEFAULT_OPTION } from "@/lib/constants";
import { Cart } from "@/lib/shopify/types";
import { createUrl } from "@/lib/utils";
import { updateCartNoteAction } from "@/lib/utils/cartActions";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { FaShoppingCart, FaArrowLeft, FaEdit, FaSave, FaTimes, FaWhatsapp } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import Price from "../Price";
import { DeleteItemButton } from "./DeleteItemButton";
import { EditItemQuantityButton } from "./EditItemQuantityButton";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartPageContent({ cart }: { cart: Cart | undefined }) {
  const [note, setNote] = useState(cart?.note || "");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleNoteUpdate = () => {
    startTransition(async () => {
      await updateCartNoteAction(null, note);
      setIsEditingNote(false);
    });
  };

  const handleNoteCancel = () => {
    setNote(cart?.note || "");
    setIsEditingNote(false);
  };

  const generateWhatsAppMessage = () => {
    if (!cart || cart.lines.length === 0) return "";
    
    const phoneNumber = "+919581154327"; // Your WhatsApp number
    let message = `Hi! I'm interested in placing an order. Here are the items in my cart:\n\n`;
    
    cart.lines.forEach((item, index) => {
      const productTitle = item.merchandise.product.title;
      const variant = item.merchandise.title !== DEFAULT_OPTION ? ` (${item.merchandise.title})` : "";
      const quantity = item.quantity;
      const price = item.cost.totalAmount.amount;
      const currency = item.cost.totalAmount.currencyCode;
      
      message += `${index + 1}. ${productTitle}${variant}\n`;
      message += `   Quantity: ${quantity}\n`;
      message += `   Price: ${currency} ${price}\n\n`;
    });
    
    message += `Total Amount: ${cart.cost.totalAmount.currencyCode} ${cart.cost.totalAmount.amount}\n`;
    message += `Total Items: ${cart.totalQuantity}\n\n`;
    
    if (note) {
      message += `Special Instructions: ${note}\n\n`;
    }
    
    message += `Please let me know about availability and delivery options. Thank you!`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = "+919581154327";
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="login-bg min-h-screen py-8 mobile-cart-spacing">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary hover:bg-[#600018] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-4"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <FaShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-dark dark:text-darkmode-text-dark">
                Your Shopping Cart
              </h1>
              <p className="text-text-light dark:text-darkmode-text-light">
                Review your items before checkout
              </p>
            </div>
          </div>
        </div>

        {!cart || cart.lines.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
              Your cart is empty
            </h2>
            <p className="text-text-light dark:text-darkmode-text-light mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary hover:bg-[#600018] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaShoppingCart className="w-4 h-4" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4 sm:mb-6">
                  Cart Items ({cart.totalQuantity})
                </h2>
                
                <div className="space-y-4 sm:space-y-6">
                  {cart.lines.map((item, i) => {
                    const merchandiseSearchParams = {} as MerchandiseSearchParams;

                    item.merchandise.selectedOptions.forEach(
                      ({ name, value }) => {
                        if (value !== DEFAULT_OPTION) {
                          merchandiseSearchParams[name.toLowerCase()] = value;
                        }
                      },
                    );

                    const merchandiseUrl = createUrl(
                      `/products/${item.merchandise.product.handle}`,
                      new URLSearchParams(merchandiseSearchParams),
                    );

                    return (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border dark:border-darkmode-border rounded-xl hover:shadow-md transition-all duration-200"
                      >
                        {/* Product Image */}
                        <Link href={merchandiseUrl} className="flex-shrink-0 w-full sm:w-auto">
                          <div className="relative w-20 h-20 sm:w-20 sm:h-20 overflow-hidden rounded-lg border border-border dark:border-darkmode-border mx-auto sm:mx-0">
                            <Image
                              className="h-full w-full object-cover"
                              // @ts-ignore
                              src={item.merchandise.product.images.edges.find((edge: any) => edge.node.altText === item.merchandise.selectedOptions.find((option: any) => option.name === "Color")?.value)?.node.url || item.merchandise.product.featuredImage?.url || "/images/product_image404.jpg"}
                              alt={item.merchandise.title}
                              width={80}
                              height={80}
                            />
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 w-full sm:w-auto">
                          <Link
                            href={merchandiseUrl}
                            className="block"
                          >
                            <h3 className="font-semibold text-text-dark dark:text-darkmode-text-dark hover:text-primary transition-colors duration-200 text-sm sm:text-base leading-tight break-words">
                              {item.merchandise.product.title}
                            </h3>
                            {item.merchandise.title !== DEFAULT_OPTION && (
                              <p className="text-xs sm:text-sm text-text-light dark:text-darkmode-text-light mt-1 break-words">
                                {item.merchandise.title}
                              </p>
                            )}
                          </Link>
                          
                          {/* Price */}
                          <div className="mt-2">
                            <Price
                              className="text-base sm:text-lg font-bold text-primary"
                              amount={item.cost.totalAmount.amount}
                              currencyCode={item.cost.totalAmount.currencyCode}
                            />
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                          <div className="flex items-center border border-border dark:border-darkmode-border rounded-lg">
                            <EditItemQuantityButton
                              item={item}
                              type="minus"
                            />
                            <span className="px-3 sm:px-4 py-2 text-sm font-medium text-text-dark dark:text-darkmode-text-dark min-w-[2.5rem] sm:min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <EditItemQuantityButton
                              item={item}
                              type="plus"
                            />
                          </div>
                          
                          {/* Delete Button */}
                          <div className="relative">
                            <DeleteItemButton item={item} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Cart Summary & Note */}
            <div className="space-y-4 sm:space-y-6">
              {/* Order Note */}
              <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-text-dark dark:text-darkmode-text-dark flex items-center gap-2">
                    <FaEdit className="w-4 h-4" />
                    Order Note
                  </h3>
                  {!isEditingNote && (
                    <button
                      onClick={() => setIsEditingNote(true)}
                      className="text-primary hover:text-[#600018] transition-colors duration-200"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isEditingNote ? (
                  <div className="space-y-3">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add special instructions, delivery notes, or any other information..."
                      className="w-full px-4 py-3 border-2 border-border dark:border-darkmode-border rounded-lg bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleNoteUpdate}
                        disabled={isPending}
                        className="flex items-center gap-2 bg-primary hover:bg-[#600018] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaSave className="w-3 h-3" />
                        {isPending ? "Saving..." : "Save Note"}
                      </button>
                      <button
                        onClick={handleNoteCancel}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        <FaTimes className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {note ? (
                      <p className="text-text-dark dark:text-darkmode-text-dark whitespace-pre-wrap">
                        {note}
                      </p>
                    ) : (
                      <p className="text-text-light dark:text-darkmode-text-light italic">
                        No order note added. Click the edit icon to add special instructions.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
                  Order Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-light dark:text-darkmode-text-light">Subtotal</span>
                    <Price
                      className="font-semibold text-text-dark dark:text-darkmode-text-dark"
                      amount={cart.cost.subtotalAmount.amount}
                      currencyCode={cart.cost.subtotalAmount.currencyCode}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-text-light dark:text-darkmode-text-light">Taxes</span>
                    <Price
                      className="font-semibold text-text-dark dark:text-darkmode-text-dark"
                      amount={cart.cost.totalTaxAmount.amount}
                      currencyCode={cart.cost.totalTaxAmount.currencyCode}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-text-light dark:text-darkmode-text-light">Shipping</span>
                    <span className="text-text-light dark:text-darkmode-text-light">Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t border-border dark:border-darkmode-border pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-text-dark dark:text-darkmode-text-dark">Total</span>
                      <Price
                        className="text-xl font-bold text-primary"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>
                </div>

                {/* No-Return Policy Notice */}

                <div className="mt-6 space-y-3">
                  <a
                    href={cart.checkoutUrl}
                    className="block w-full bg-primary hover:bg-[#600018] text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
                  >
                    Proceed to Checkout
                  </a>
                  
                  {/* WhatsApp Contact Button */}
                  <button
                    onClick={handleWhatsAppContact}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    <span>Contact Us with Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

