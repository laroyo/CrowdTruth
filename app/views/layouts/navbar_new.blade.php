
		<div class="navbar navbar-default navbar-static-top" role="navigation">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					{{ link_to('/', "CrowdTruth", array('class' => 'navbar-brand')); }}

				</div>
				<div class="navbar-collapse collapse">
					<ul class="nav navbar-nav">
						<li{{ (Request::segment(1) == 'media' ? ' class="active"' : '') }} data-toggle="tooltip" data-placement="bottom" title="Search Existing Media <br /> View Media Analytics <br /> Upload New Media">{{ link_to('media', "Media") }}</li>
						<li{{ (Request::segment(1) == 'jobs' ? ' class="active"' : '') }} data-toggle="tooltip" data-placement="bottom" title="View Existing Job Analytics <br /> Create New Jobs">
						{{ link_to('jobs', "Jobs") }}</li>
						<li{{ (Request::segment(1) == 'workers' ? ' class="active"' : '') }} data-toggle="tooltip" data-placement="bottom" title="View Worker Analytics">
						{{ link_to('workers', "Workers") }}</li>
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">More <b class="caret"></b></a>
							<ul class="dropdown-menu">
								<li><a href="#">Crowd Truth</a></li>
								<li><a href="#">Dr. Detective</a></li>
								<li class="divider"></li>
								<li><a href="#">VU</a></li>
								<li><a href="#">IBM</a></li>
							</ul>
						</li>
					</ul>
					@include('layouts.dynamic_selection_user')
				</div><!--/.nav-collapse -->
			</div>
		</div>