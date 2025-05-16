"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  ArrowLeft,
  IndianRupee,
  Loader2,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function InvoicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "100",
    invoiceId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
    paymentId: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
    paymentMethod: "UPI",
  });
  const [date, setDate] = useState<Date>(new Date());
  const [isPreview, setIsPreview] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const logoUrl = "https://policyapps.in/whatsapp_automation/123455555.png";

  // Preload the image
  useEffect(() => {
    if (isPreview) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = (e) => console.error("Error loading logo:", e);
      img.src = logoUrl;
    }
  }, [isPreview]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle print functionality using window.print()
  const handlePrint = () => {
    setIsPrinting(true);

    // Add a small delay to allow state update
    setTimeout(() => {
      try {
        window.print();
        console.log("PDF generated successfully");
      } catch (error) {
        console.error("Failed to generate PDF:", error);
      } finally {
        setIsPrinting(false);
      }
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPreview(true);
  };

  const handleBack = () => {
    if (isPreview) {
      setIsPreview(false);
    } else {
      router.push("/");
    }
  };

  const formattedDate = format(date, "MMMM d, yyyy");

  // Add print-specific CSS to ensure proper layout when printing
  useEffect(() => {
    // Add print styles when component mounts
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page { size: auto; margin: 3mm; }
        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; font-size: 85%; }
        
        /* Hide non-invoice elements when printing */
        header, .no-print { display: none !important; }
        
        /* Force flex layout to remain as flex in print */
        .print-flex { display: flex !important; }
        .print-flex-row { flex-direction: row !important; }
        .print-items-center { align-items: center !important; }
        .print-justify-between { justify-content: space-between !important; }
        
        /* Ensure company info and invoice details stay side by side */
        .company-info { width: 50% !important; }
        .invoice-details { width: 50% !important; text-align: right !important; }
        
        /* Adjust font sizes for print */
        .text-sm { font-size: 0.7rem !important; }
        .text-lg { font-size: 0.9rem !important; }
        .text-xl { font-size: 1rem !important; }
        .text-2xl { font-size: 1.1rem !important; }
        
        /* Adjust spacing for print */
        .p-8 { padding: 0.75rem !important; }
        .p-6 { padding: 0.75rem !important; }
        .p-4 { padding: 0.5rem !important; }
        .p-3 { padding: 0.375rem !important; }
        .mb-8 { margin-bottom: 0.5rem !important; }
        .mb-6 { margin-bottom: 0.375rem !important; }
        .mb-4 { margin-bottom: 0.25rem !important; }
        .mb-3 { margin-bottom: 0.2rem !important; }
        .mb-1 { margin-bottom: 0.1rem !important; }
        .py-4 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
        .px-4 { padding-left: 0.25rem !important; padding-right: 0.25rem !important; }
        .py-3 { padding-top: 0.2rem !important; padding-bottom: 0.2rem !important; }
        .py-2 { padding-top: 0.15rem !important; padding-bottom: 0.15rem !important; }
        .px-3 { padding-left: 0.2rem !important; padding-right: 0.2rem !important; }
        .pt-4 { padding-top: 0.25rem !important; }
        .pt-2 { padding-top: 0.15rem !important; }
        .mt-8 { margin-top: 0.5rem !important; }
        .mt-3 { margin-top: 0.2rem !important; }
        
        /* Reduce table cell padding */
        table th, table td { padding: 0.2rem !important; }
      }
    `;
    style.id = "invoice-print-styles";
    document.head.appendChild(style);

    // Clean up when component unmounts
    return () => {
      const styleElement = document.getElementById("invoice-print-styles");
      if (styleElement) styleElement.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            {isPreview ? "Invoice Preview" : "Generate Invoice"}
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 overflow-auto safe-bottom">
        {!isPreview ? (
          // Form View - This is where users enter customer information
          <Card className="max-w-md mx-auto border-none shadow-lg">
            <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
            <CardHeader>
              <CardTitle className="text-center text-gray-800 dark:text-gray-200">
                Generate Invoice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="amount"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Amount (₹)
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <IndianRupee className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="amount"
                      name="amount"
                      type="text"
                      placeholder="100"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                      className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Invoice Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formattedDate}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => newDate && setDate(newDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="paymentMethod"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Payment Method
                  </Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      handleSelectChange("paymentMethod", value)
                    }
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Net Banking">Net Banking</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="invoiceId"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Invoice ID
                  </Label>
                  <Input
                    id="invoiceId"
                    name="invoiceId"
                    value={formData.invoiceId}
                    onChange={handleInputChange}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="paymentId"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Payment ID
                  </Label>
                  <Input
                    id="paymentId"
                    name="paymentId"
                    value={formData.paymentId}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600"
                >
                  Generate Invoice
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          // Invoice Preview - This shows after form submission
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-end mb-4 no-print">
              {/* Use simple button with window.print() instead of ReactToPrint */}
              <Button
                onClick={handlePrint}
                disabled={isPrinting}
                className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600"
              >
                {isPrinting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>

            {/* Make sure the ref is properly attached to this div */}
            <div
              ref={invoiceRef}
              className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20 p-6 rounded-lg shadow-lg border-none"
            >
              {/* Logo - Centered at the top */}
              <div className="flex justify-center mb-4">
                <div className="w-40 h-20 flex items-center justify-center">
                  <img
                    src={logoUrl || "/placeholder.svg"}
                    alt="ABC DEVELOPERS"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement("div");
                        fallback.className =
                          "h-full w-full flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white font-bold rounded";
                        fallback.textContent = "ABC DEVELOPERS";
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Company Info and Invoice Details */}
              <div
                className="flex flex-col md:flex-row print-flex print-flex-row print-justify-between mb-4 pb-2 border-b-4"
                style={{
                  borderImage:
                    "linear-gradient(to right, #c084fc, #f472b6, #fb923c) 1",
                }}
              >
                {/* Company Info - Left side */}
                <div className="company-info mb-2 md:mb-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Top Floor Back Side, Plot.143 Pvt.8, Kh.13/5,
                    <br />
                    Near Patel Garden Exention, Kakrola,
                    <br />
                    West Delhi, Delhi, 110078
                    <br />
                    Mobile: +91 75572 32450
                    <br />
                    Email: dev.abcdevelopers@gmail.com
                  </p>
                </div>

                {/* Vertical Line */}
                <div className="hidden md:block print-block h-auto w-px bg-gradient-to-b from-purple-400 via-pink-400 to-orange-400 mx-2"></div>

                {/* Invoice Details - Right side */}
                <div className="invoice-details text-right">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-1">
                    INVOICE
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    <span className="font-medium">Invoice #:</span>{" "}
                    {formData.invoiceId}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    <span className="font-medium">Date:</span> {formattedDate}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">GSTIN:</span> 07CODPP2501L1ZZ
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">
                  Bill To:
                </h2>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {formData.name}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.email}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.phone}
                </p>
              </div>

              {/* Invoice Items */}
              <div className="mb-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300 rounded-tl-lg">
                        Description
                      </th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">
                        Quantity
                      </th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">
                        Price
                      </th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-700 dark:text-gray-300 rounded-tr-lg">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30">
                      <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                        <div className="font-medium">
                          {formData.amount} Credits
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Digital Credits
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center text-gray-700 dark:text-gray-300">
                        1
                      </td>
                      <td className="py-2 px-3 text-right text-gray-700 dark:text-gray-300">
                        ₹{formData.amount}
                      </td>
                      <td className="py-2 px-3 text-right text-gray-700 dark:text-gray-300">
                        ₹{formData.amount}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-white/70 dark:bg-gray-800/20">
                      <td colSpan={2} className="py-2 px-3"></td>
                      <td className="py-2 px-3 text-right font-medium text-gray-700 dark:text-gray-300">
                        Subtotal
                      </td>
                      <td className="py-2 px-3 text-right text-gray-700 dark:text-gray-300">
                        ₹{formData.amount}
                      </td>
                    </tr>
                    <tr className="bg-white/70 dark:bg-gray-800/20">
                      <td colSpan={2} className="py-2 px-3"></td>
                      <td className="py-2 px-3 text-right font-medium text-gray-700 dark:text-gray-300">
                        GST (0%)
                      </td>
                      <td className="py-2 px-3 text-right text-gray-700 dark:text-gray-300">
                        ₹0
                      </td>
                    </tr>
                    <tr className="bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/60 dark:to-pink-900/60 rounded-b-lg">
                      <td colSpan={2} className="py-2 px-3 rounded-bl-lg"></td>
                      <td className="py-2 px-3 text-right font-bold text-gray-800 dark:text-gray-200">
                        Total
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-gray-800 dark:text-gray-200 rounded-br-lg">
                        ₹{formData.amount}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment Info */}
              <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 rounded-lg">
                <h2 className="text-lg font-semibold text-pink-700 dark:text-pink-300 mb-2">
                  Payment Information:
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  <span className="font-medium">Payment Method:</span>{" "}
                  {formData.paymentMethod}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  <span className="font-medium">Invoice ID:</span>{" "}
                  {formData.invoiceId}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  <span className="font-medium">Payment ID:</span>{" "}
                  {formData.paymentId}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Paid
                  </span>
                </p>
              </div>

              {/* Notes */}
              <div
                className="border-t-4 pt-2"
                style={{
                  borderImage:
                    "linear-gradient(to right, #fb923c, #f472b6, #c084fc) 1",
                }}
              >
                <h2 className="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-2">
                  Notes:
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Thank you for purchasing {formData.amount} credits. These
                  credits have been added to your account and are available for
                  immediate use. For any questions or support, please contact
                  our customer service team.
                </p>
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 p-2 bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-900/20 dark:to-purple-900/20 rounded-lg">
                  <p>ABC Developers | GSTIN: 07CODPP2501L1ZZ</p>
                  <p>
                    This is a computer-generated document. No signature is
                    required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
