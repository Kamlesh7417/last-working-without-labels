import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Order } from '../../utils/mockData';
import PaymentModal from './PaymentModal';
import ShippingOptionsCard from '../shipping/ShippingOptionsCard';

interface ShippingRecommendationsProps {
  order: Order;
  onClose: () => void;
}

const carrierOptions = [
  {
    id: 'dhl',
    carrier: 'DHL',
    logo: 'https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg',
    service: 'Express Air Freight',
    deliveryTime: '1-2 days',
    originalPrice: 950,
    negotiatedPrice: 850,
    rating: 4.8,
    isBestOption: true
  },
  {
    id: 'fedex',
    carrier: 'FedEx',
    logo: 'https://www.fedex.com/content/dam/fedex-com/logos/logo.png',
    service: 'Priority Freight',
    deliveryTime: '2-3 days',
    originalPrice: 850,
    negotiatedPrice: 780,
    rating: 4.7
  },
  {
    id: 'ups',
    carrier: 'UPS',
    logo: 'https://www.ups.com/assets/resources/images/UPS_logo.svg',
    service: 'Express Saver',
    deliveryTime: '2-3 days',
    originalPrice: 880,
    negotiatedPrice: 800,
    rating: 4.6
  },
  {
    id: 'bluedart',
    carrier: 'Bluedart',
    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgODAiPjxwYXRoIGZpbGw9IiMwMDM0NzgiIGQ9Ik00My41IDBoMTUzdjgwSDQzLjV6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTY4LjUgMjBoMTAzdjQwSDY4LjV6Ii8+PHRleHQgeD0iNzMuNSIgeT0iNDgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwMzQ3OCI+Qmx1ZWRhcnQ8L3RleHQ+PC9zdmc+',
    service: 'Surface Express',
    deliveryTime: '3-4 days',
    originalPrice: 750,
    negotiatedPrice: 680,
    rating: 4.5
  }
];

const ShippingRecommendations: React.FC<ShippingRecommendationsProps> = ({ order, onClose }) => {
  const [selectedCarrier, setSelectedCarrier] = useState<typeof carrierOptions[0] | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleCarrierSelect = (carrier: typeof carrierOptions[0]) => {
    setSelectedCarrier(carrier);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card w-full max-w-4xl m-4 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold">AI Price Calculator</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <ShippingOptionsCard
            data={carrierOptions}
            onSelect={handleCarrierSelect}
          />
        </div>
      </motion.div>

      {showPayment && selectedCarrier && (
        <PaymentModal
          amount={selectedCarrier.negotiatedPrice}
          carrierName={selectedCarrier.carrier}
          orderId={order.order_id}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </motion.div>
  );
};

export default ShippingRecommendations;