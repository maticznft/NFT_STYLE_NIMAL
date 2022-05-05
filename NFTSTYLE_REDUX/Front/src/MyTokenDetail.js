MyTokenDetail 
&& MyTokenDetail.tokenOwner
&&item
&&item.tokenBid==true
&& item.clocktime != null
&& item.endclocktime != null
&& new Date((item.endclocktime) > Date.now()) ?
<Button className="btn-block bnt_pos_right">
  Action Not Complete Yet
</Button>
:
<Button className="connect_btn btn-block bnt_pos_right mt-3 mt-lg-0" onClick={() => PutOnSaleForwardRef.current.PutOnSale_Click(item, MyTokenDetail)}>Place order</Button>

